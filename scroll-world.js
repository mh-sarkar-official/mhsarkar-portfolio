(() => {
  const section = document.querySelector('.cinematic');
  if (!section) return;

  const stage = section.querySelector('.cinematic-stage');
  const videos = [...section.querySelectorAll('[data-cinematic-clip]')];
  const progressBar = section.querySelector('.cinematic-progress span');
  const wash = section.querySelector('.cinematic-wash');
  const beats = [...section.querySelectorAll('[data-cinematic-beat]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)');
  const small = window.matchMedia('(max-width: 47.99rem)');

  const STATIC = () => reduced.matches || coarse.matches || small.matches;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const CLIP_DURATION = 8;
  const beatMap = [0, 1, 1, 2, 3, 4];

  let activeClip = 0;
  let activeBeat = -1;
  let targetTime = 0;
  let ticking = false;
  let primed = false;
  let readyCount = 0;

  function setBeat(index) {
    if (index === activeBeat) return;
    activeBeat = index;
    beats.forEach((beat, i) => beat.classList.toggle('is-active', i === index));
  }

  function setActiveClip(index) {
    if (index === activeClip) return;
    activeClip = index;

    videos.forEach((video, i) => {
      video.classList.toggle('is-active', i === index);
      if (i !== index) video.pause();
    });
  }

  function seekActive() {
    if (STATIC()) return;
    const video = videos[activeClip];
    if (!video || video.readyState < 1 || video.seeking) return;

    const safeTarget = clamp(targetTime, 0.001, Math.max(0.001, CLIP_DURATION - 0.035));
    if (Math.abs(video.currentTime - safeTarget) < 0.035) return;

    try {
      if (typeof video.fastSeek === 'function' && Math.abs(video.currentTime - safeTarget) > 1.2) {
        video.fastSeek(safeTarget);
      } else {
        video.currentTime = safeTarget;
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

    const scrollRange = Math.max(1, section.offsetHeight - stage.offsetHeight);
    const progress = clamp((window.scrollY - section.offsetTop) / scrollRange);
    const total = progress * videos.length;
    const clipIndex = Math.min(videos.length - 1, Math.floor(total));
    const localProgress = clipIndex === videos.length - 1 && progress === 1
      ? 1
      : total - clipIndex;

    targetTime = localProgress * CLIP_DURATION;
    setActiveClip(clipIndex);
    seekActive();

    progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;
    setBeat(beatMap[clipIndex] ?? beatMap[beatMap.length - 1]);

    const fade = clamp((progress - 0.91) / 0.09);
    wash.style.opacity = fade.toFixed(3);
  }

  function requestRead() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(read);
  }

  function prime() {
    if (primed || STATIC()) return;
    primed = true;

    const video = videos[activeClip];
    if (!video) return;

    const play = video.play();
    if (play && typeof play.then === 'function') {
      play.then(() => {
        video.pause();
        seekActive();
      }).catch(() => {});
    }
  }

  function loadVideoAssets() {
    if (STATIC()) {
      setBeat(0);
      return;
    }

    videos.forEach((video, index) => {
      video.preload = 'auto';
      video.src = video.dataset.src;

      video.addEventListener('loadeddata', () => {
        video.pause();
        readyCount += 1;
        if (index === 0 || readyCount === videos.length) {
          section.classList.add('is-ready');
          requestRead();
        }
      }, { once: true });

      video.addEventListener('seeked', () => {
        if (index === activeClip) seekActive();
      });

      video.load();
    });
  }

  loadVideoAssets();
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