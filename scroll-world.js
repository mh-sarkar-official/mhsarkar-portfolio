(() => {
  const section = document.querySelector('.cinematic');
  if (!section) return;

  const stage = section.querySelector('.cinematic-stage');
  const videos = [...section.querySelectorAll('[data-cinematic-clip]')];
  const progressBar = section.querySelector('.cinematic-progress span');
  const wash = section.querySelector('.cinematic-wash');
  const beats = [...section.querySelectorAll('[data-cinematic-beat]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const STATIC = () => reduced.matches;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const beatMap = [0, 1, 1, 2, 3, 4];
  const clipDurations = [8, 8, 8, 8, 8, 7.541667];

  let activeClip = 0;
  let activeBeat = -1;
  let targetTime = 0;
  let ticking = false;
  let userPrimed = false;

  function setBeat(index) {
    if (index === activeBeat) return;
    activeBeat = index;
    beats.forEach((beat, i) => beat.classList.toggle('is-active', i === index));
  }

  function primeVideo(video) {
    if (!video || video.dataset.primed === 'true' || video.readyState < 1) return;

    const play = video.play();
    if (play && typeof play.then === 'function') {
      play.then(() => {
        video.pause();
        video.dataset.primed = 'true';
        if (video === videos[activeClip]) seekActive();
      }).catch(() => {});
    }
  }

  function ensureLoaded(index, eager = false) {
    const video = videos[index];
    if (!video || video.dataset.loaded === 'true') return;

    video.dataset.loaded = 'true';
    video.preload = eager ? 'auto' : 'metadata';
    video.src = video.dataset.src;
    video.load();
  }

  function warmAround(index) {
    ensureLoaded(index, true);
    ensureLoaded(index - 1, false);
    ensureLoaded(index + 1, true);

    if (userPrimed) {
      primeVideo(videos[index]);
      primeVideo(videos[index + 1]);
    }
  }

  function setActiveClip(index) {
    if (index !== activeClip) {
      activeClip = index;

      videos.forEach((video, i) => {
        video.classList.toggle('is-active', i === index);
        if (i !== index) video.pause();
      });
    }

    warmAround(index);
  }

  function seekActive() {
    if (STATIC()) return;

    const video = videos[activeClip];
    if (!video || video.readyState < 1 || video.seeking) return;

    const duration = Number.isFinite(video.duration) && video.duration > 0
      ? video.duration
      : clipDurations[activeClip];

    const safeTarget = clamp(targetTime, 0.001, Math.max(0.001, duration - 0.035));
    if (Math.abs(video.currentTime - safeTarget) < 0.03) return;

    try {
      if (typeof video.fastSeek === 'function' && Math.abs(video.currentTime - safeTarget) > 1.15) {
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

    targetTime = localProgress * clipDurations[clipIndex];

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
    if (userPrimed || STATIC()) return;
    userPrimed = true;

    primeVideo(videos[activeClip]);
    primeVideo(videos[activeClip + 1]);
  }

  videos.forEach((video, index) => {
    video.addEventListener('loadedmetadata', () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        clipDurations[index] = video.duration;
      }

      if (userPrimed && (index === activeClip || index === activeClip + 1)) {
        primeVideo(video);
      }

      requestRead();
    });

    video.addEventListener('loadeddata', () => {
      video.pause();
      if (index === 0) section.classList.add('is-ready');
      requestRead();
    });

    video.addEventListener('seeked', () => {
      if (index === activeClip) seekActive();
    });
  });

  if (!STATIC()) {
    ensureLoaded(0, true);
    ensureLoaded(1, true);
  }

  setBeat(0);

  window.addEventListener('scroll', requestRead, { passive: true });
  window.addEventListener('resize', requestRead);
  window.addEventListener('wheel', prime, { passive: true, once: true });
  window.addEventListener('pointerdown', prime, { passive: true, once: true });
  window.addEventListener('touchstart', prime, { passive: true, once: true });

  reduced.addEventListener('change', () => window.location.reload());

  requestRead();
})();