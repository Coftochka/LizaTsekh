// Shared lifecycle controller for expensive interface animations.
// It deliberately pauses scheduling rather than merely skipping work in a tick.
(function (global) {
  function observe(element, onChange, options) {
    let inZone = false;
    let externallyPaused = false;
    let active = false;

    const update = () => {
      const next = inZone && !externallyPaused && !document.hidden;
      if (next === active) return;
      active = next;
      element.toggleAttribute('data-interface-paused', !next);
      onChange(next);
    };

    const observer = new IntersectionObserver(entries => {
      inZone = entries.some(entry => entry.isIntersecting);
      update();
    }, {
      root: null,
      rootMargin: '300px 0px',
      threshold: 0
    });
    observer.observe(element);

    const onVisibilityChange = () => update();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return {
      setExternallyPaused(paused) {
        externallyPaused = Boolean(paused);
        update();
      },
      disconnect() {
        observer.disconnect();
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }
    };
  }

  global.InterfaceActivity = { observe };
})(window);
