const buttons = [...document.querySelectorAll('.filter')];
const projects = [...document.querySelectorAll('.project')];
const status = document.querySelector('#filter-status');
const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionReady = Boolean(window.gsap && window.ScrollTrigger && window.Flip);

if (motionReady) {
  gsap.registerPlugin(ScrollTrigger, Flip);
  document.documentElement.classList.add('motion-enhanced');
}

function setFilterButtonState(activeButton) {
  buttons.forEach((item) => {
    const active = item === activeButton;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
}

function applyProjectFilter(button) {
  const filter = button.dataset.filter;
  const animate = motionReady && !reduceQuery.matches;
  const state = animate ? Flip.getState(projects) : null;

  setFilterButtonState(button);

  let visibleCount = 0;

  projects.forEach((project) => {
    const categories = project.dataset.category.split(' ');
    const visible = filter === 'all' || categories.includes(filter);
    project.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  status.textContent = `${visibleCount} project${visibleCount === 1 ? '' : 's'} shown`;

  if (state) {
    Flip.from(state, {
      duration: 0.46,
      ease: 'power2.inOut',
      absolute: true,
      prune: true,
      simple: true,
      onEnter: (elements) => gsap.fromTo(
        elements,
        { autoAlpha: 0, y: 12, scale: 0.985 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out', clearProps: 'opacity,visibility,transform' }
      ),
      onLeave: (elements) => gsap.to(
        elements,
        { autoAlpha: 0, y: -8, duration: 0.18, ease: 'power1.in' }
      ),
      onComplete: () => ScrollTrigger.refresh()
    });
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => applyProjectFilter(button));

  if (motionReady) {
    button.addEventListener('pointerdown', () => {
      if (!reduceQuery.matches) gsap.to(button, { scale: 0.975, duration: 0.08, ease: 'power1.out' });
    });

    const release = () => {
      if (!reduceQuery.matches) gsap.to(button, { scale: 1, duration: 0.16, ease: 'power2.out' });
    };

    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('pointerleave', release);
  }
});

function initPortfolioMotion() {
  if (!motionReady) return;

  const mm = gsap.matchMedia();

  mm.add(
    {
      motionOK: '(prefers-reduced-motion: no-preference)',
      reduced: '(prefers-reduced-motion: reduce)',
      desktop: '(min-width: 48rem)'
    },
    (context) => {
      const { motionOK, desktop } = context.conditions;

      if (!motionOK) {
        gsap.set(
          [
            '.site-header > *',
            '.hero-meta span',
            '.hero-copy h1',
            '.hero-copy > p',
            '.hero-links a',
            '.hero-portrait',
            '.hero-portrait figcaption span',
            '.project',
            '.section-head > *',
            '.timeline article',
            '.stack-grid > div',
            '.publication > *',
            '.contact > *'
          ],
          { clearProps: 'all' }
        );
        return;
      }

      if (window.scrollY < 140) {
        const heroTimeline = gsap.timeline({
          defaults: { duration: 0.58, ease: 'power3.out' }
        });

        heroTimeline
          .from('.site-header > *', {
            y: -12,
            autoAlpha: 0,
            stagger: 0.055,
            duration: 0.42
          })
          .from('.hero-meta span', {
            y: 10,
            autoAlpha: 0,
            stagger: 0.055
          }, '-=0.2')
          .from('.hero-copy h1', {
            y: 34,
            autoAlpha: 0,
            duration: 0.82
          }, '-=0.22')
          .from('.hero-copy > p', {
            y: 16,
            autoAlpha: 0
          }, '-=0.44')
          .from('.hero-links a', {
            y: 8,
            autoAlpha: 0,
            stagger: 0.05,
            duration: 0.42
          }, '-=0.32')
          .from('.hero-portrait', {
            x: desktop ? 22 : 0,
            y: desktop ? 0 : 14,
            scale: 0.988,
            autoAlpha: 0,
            duration: 0.78
          }, '-=0.72')
          .from('.hero-portrait figcaption span', {
            y: 6,
            autoAlpha: 0,
            stagger: 0.04,
            duration: 0.34
          }, '-=0.28');
      }

      ScrollTrigger.batch('.project', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { y: 22, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.52,
              stagger: 0.07,
              ease: 'power3.out',
              clearProps: 'opacity,visibility,transform'
            }
          );

          batch.forEach((card, index) => {
            const cells = card.querySelectorAll('.capability-map span');
            if (!cells.length) return;

            gsap.fromTo(
              cells,
              { y: 6, autoAlpha: 0.35 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.3,
                stagger: 0.035,
                delay: 0.08 + index * 0.03,
                ease: 'power2.out',
                clearProps: 'opacity,visibility,transform'
              }
            );
          });
        }
      });

      gsap.utils.toArray('.section-head').forEach((sectionHead) => {
        gsap.from(sectionHead.children, {
          y: 18,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionHead,
            start: 'top 86%',
            once: true
          }
        });
      });

      ScrollTrigger.batch('.timeline article', {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => gsap.fromTo(
          batch,
          { y: 16, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.46,
            stagger: 0.065,
            ease: 'power2.out',
            clearProps: 'opacity,visibility,transform'
          }
        )
      });

      ScrollTrigger.batch('.stack-grid > div', {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => gsap.fromTo(
          batch,
          { y: 14, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.44,
            stagger: 0.055,
            ease: 'power2.out',
            clearProps: 'opacity,visibility,transform'
          }
        )
      });

      gsap.from('.poster-number', {
        x: -26,
        autoAlpha: 0,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.experience-poster',
          start: 'top 82%',
          once: true
        }
      });

      gsap.from('.poster-grid p', {
        y: 14,
        autoAlpha: 0,
        duration: 0.48,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.experience-poster',
          start: 'top 82%',
          once: true
        }
      });

      gsap.from('.publication > *', {
        y: 18,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.52,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.publication',
          start: 'top 86%',
          once: true
        }
      });

      gsap.from('.contact > *', {
        y: 20,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.55,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact',
          start: 'top 86%',
          once: true
        }
      });

      const hoverCleanups = [];

      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        projects.forEach((project) => {
          const enter = () => gsap.to(project, {
            y: -3,
            duration: 0.18,
            ease: 'power2.out',
            overwrite: 'auto'
          });

          const leave = () => gsap.to(project, {
            y: 0,
            duration: 0.22,
            ease: 'power2.out',
            overwrite: 'auto'
          });

          project.addEventListener('pointerenter', enter);
          project.addEventListener('pointerleave', leave);

          hoverCleanups.push(() => {
            project.removeEventListener('pointerenter', enter);
            project.removeEventListener('pointerleave', leave);
          });
        });
      }

      ScrollTrigger.refresh();

      return () => {
        hoverCleanups.forEach((cleanup) => cleanup());
      };
    }
  );

  reduceQuery.addEventListener('change', () => ScrollTrigger.refresh());
}

const fontsReady = document.fonts?.ready || Promise.resolve();
fontsReady.then(initPortfolioMotion);

document.querySelector('#year').textContent = new Date().getFullYear();
