/* Existing Higgsfield film, loaded only when the viewer asks to play it. */
(() => {
  'use strict';
  (window.DESIGNX_MOUNTS ||= []).push(root => {
    const video = root.querySelector('[data-customer-film]');
    const button = root.querySelector('[data-customer-play]');
    if (!video || !button) return;
    const scene = video.closest('.slide');
    const sync = () => {
      button.textContent = video.paused ? 'Play film ↗' : 'Pause film';
      button.setAttribute('aria-label', `${video.paused ? 'Play' : 'Pause'} resort concept film`);
      button.setAttribute('aria-pressed', String(!video.paused));
    };
    button.addEventListener('click', async () => {
      if (!video.paused) { video.pause(); return; }
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      video.muted = true;
      try {
        await video.play();
        video.classList.add('is-playing-film');
      } catch { sync(); }
    });
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    video.addEventListener('ended', () => { video.classList.remove('is-playing-film'); sync(); });
    document.addEventListener('designx:slidechange', event => {
      if (event.detail.element !== scene || event.detail.printMode) video.pause();
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
    document.addEventListener('designx:motionchange', () => { video.pause(); });
    sync();
  });
})();
