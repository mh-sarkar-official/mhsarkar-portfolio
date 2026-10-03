const buttons = [...document.querySelectorAll('.filter')];
const projects = [...document.querySelectorAll('.project')];
const status = document.querySelector('#filter-status');

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    buttons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    let visibleCount = 0;

    projects.forEach((project) => {
      const categories = project.dataset.category.split(' ');
      const visible = filter === 'all' || categories.includes(filter);
      project.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    status.textContent = `${visibleCount} project${visibleCount === 1 ? '' : 's'} shown`;
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

const world = document.querySelector('.world-journey');

if (world) {
  const map = world.querySelector('.world-map');
  const copies = [...world.querySelectorAll('[data-world-step]')];
  const dots = [...world.querySelectorAll('[data-world-jump]')];
  const progressFill = world.querySelector('.world-progress span');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeWorldStep = -1;
  let worldTicking = false;

  const clamp01 = (value) => Math.min(1, Math.max(0, value));

  const setWorldStep = (step) => {
    if (step === activeWorldStep) return;
    activeWorldStep = step;

    copies.forEach((copy, index) => {
      copy.classList.toggle('is-active', index === step);
    });

    dots.forEach((dot, index) => {
      const active = index === step;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  };

  const readWorld = () => {
    worldTicking = false;
    if (reduceMotion) {
      setWorldStep(0);
      return;
    }

    const rect = world.getBoundingClientRect();
    const scrollable = Math.max(1, rect.height - window.innerHeight);
    const progress = clamp01(-rect.top / scrollable);
    const step = Math.min(3, Math.floor(progress * 4));

    const viewportWidth = window.innerWidth;
    const mapWidth = map.getBoundingClientRect().width;
    const travel = Math.max(0, mapWidth - viewportWidth);
    const eased = progress * progress * (3 - 2 * progress);
    const zoom = 1.02 + Math.sin(progress * Math.PI) * 0.055;
    const lift = Math.sin(progress * Math.PI * 2) * 10;

    map.style.transform = `translate3d(${(-travel * eased).toFixed(1)}px, calc(-50% + ${lift.toFixed(1)}px), 0) scale(${zoom.toFixed(3)})`;
    progressFill.style.transform = `scaleX(${progress.toFixed(4)})`;
    setWorldStep(step);
  };

  const requestWorldRead = () => {
    if (worldTicking) return;
    worldTicking = true;
    requestAnimationFrame(readWorld);
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const step = Number(dot.dataset.worldJump);
      const target = world.offsetTop + (world.offsetHeight - window.innerHeight) * (step / 3);
      window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  window.addEventListener('scroll', requestWorldRead, { passive: true });
  window.addEventListener('resize', requestWorldRead);
  requestWorldRead();
}
