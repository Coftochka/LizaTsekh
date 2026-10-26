// Shared lifecycle for expensive animations. Classic script is intentional:
// legacy x-import loads its custom elements as ordinary browser scripts.
(function (global) {
  function observe(element, onChange) {
    var nearViewport = false;
    var externallyPaused = false;
    var active = false;

    function update() {
      var next = nearViewport && !externallyPaused && !document.hidden;
      if (next === active) return;
      active = next;
      element.toggleAttribute('data-interface-paused', !next);
      onChange(next);
    }

    if (!('IntersectionObserver' in global)) {
      nearViewport = true;
      update();
      return { disconnect: function () {}, setExternallyPaused: function () {} };
    }

    var observer = new IntersectionObserver(function (entries) {
      nearViewport = entries.some(function (entry) { return entry.isIntersecting; });
      update();
    }, { root: null, rootMargin: '300px 0px', threshold: 0 });

    function onVisibilityChange() { update(); }
    observer.observe(element);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return {
      disconnect: function () { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibilityChange); },
      setExternallyPaused: function (paused) { externallyPaused = Boolean(paused); update(); },
    };
  }
  global.InterfaceActivity = { observe: observe };
}(window));
