(() => {
  const section = document.querySelector('.cinematic');
  if (!section) return;

  const video = section.querySelector('.cinematic-video');
  const progressBar = section.querySelector('.cinematic-progress span');
  const wash = section.querySelector('.cinematic-wash');
  const beats = [...section.querySelectorAll('[data-cinematic-beat]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)');
  const small = window.matchMedia('(max-width: 47.99rem)');

  const STATIC = () => reduced.matches || coarse.matches || small.matches;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const thresholds = [0, 0.17, 0.50, 0.67, 0.84];
  const fallbackDuration = 47.291667;

  let duration = fallbackDuration;
  let targetTime = 0;
  let activeBeat = -1;
  let ticking = false;
  let primed = false;

  function setBeat(index) {
    if (index === activeBeat) return;
    activeBeat = index;
    beats.forEach((beat, i) => beat.classList.toggle('is-active', i === index));
  }

  function beatFor(progress) {
    let index = 0;
    for (let i = 1; i < thresholds.length; i += 1) {
      if (progress >= thresholds[i]) index = i;
    }
    return index;
  }

  function seekTarget() {
    if (!video || !Number.isFinite(targetTime) || STATIC()) return;
    if (video.readyState < 1 || video.seeking) return;
    if (Math.abs(video.currentTime - targetTime) < 0.035) return;

    try {
      if (typeof video.fastSeek === 'function' && Math.abs(video.currentTime - targetTime) > 1.2) {
        video.fastSeek(targetTime);
      } else {
        video.currentTime = targetTime;
      }
    } catch (_) {}
  }

  function read() {
    ticking = false;

    if (STATIC()) {
      section.classList.add('is-static');
      setBeat(0);
      return;
    }

    section.classList.remove('is-static');

    const stage = section.querySelector('.cinematic-stage');
    const scrollRange = Math.max(1, section.offsetHeight - stage.offsetHeight);
    const progress = clamp((window.scrollY - section.offsetTop) / scrollRange);

    targetTime = progress * duration;
    seekTarget();

    progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;
    setBeat(beatFor(progress));

    const fade = clamp((progress - 0.91) / 0.09);
    wash.style.opacity = fade.toFixed(3);
    video.style.opacity = String(1 - fade * 0.78);
  }

  function requestRead() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(read);
  }

  function prime() {
    if (primed || STATIC() || !video.src) return;
    primed = true;
    const play = video.play();
    if (play && typeof play.then === 'function') {
      play.then(() => {
        video.pause();
        seekTarget();
      }).catch(() => {});
    }
  }

  function loadVideo() {
    if (STATIC()) {
      setBeat(0);
      return;
    }

    if (!video.src) {
      video.src = video.dataset.src;
      video.load();
    }

    video.addEventListener('loadedmetadata', () => {
      if (Number.isFinite(video.duration) && video.duration > 0) duration = video.duration;
      requestRead();
    }, { once: true });

    video.addEventListener('loadeddata', () => {
      section.classList.add('is-ready');
      requestRead();
    }, { once: true });

    video.addEventListener('seeked', seekTarget);
  }

  loadVideo();
  setBeat(0);

  window.addEventListener('scroll', requestRead, { passive: true });
  window.addEventListener('resize', requestRead);
  window.addEventListener('wheel', prime, { passive: true, once: true });
  window.addEventListener('pointerdown', prime, { passive: true, once: true });
  window.addEventListener('touchstart', prime, { passive: true, once: true });

  reduced.addEventListener('change', () => window.location.reload());
  small.addEventListener('change', () => window.location.reload());

  requestRead();
})();
