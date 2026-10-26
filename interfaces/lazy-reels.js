/*
 * Defers expensive animated previews until the user is about to see them.
 *
 * This script runs before support.js. It replaces only the three standalone
 * reel components with placeholders, so support.js does not construct every
 * canvas/SVG animation during the first page render. The original component
 * is mounted 300px before it enters the viewport; activity.js pauses its
 * animation again after it has scrolled away.
 */
(function () {
  'use strict';

  var modules = new Map();
  var supported = new Set(['case-reel', 'dash-reel', 'original-deck-reel']);
  var mounted = new WeakSet();
  var observed = new WeakSet();

  function loadModule(source) {
    if (modules.has(source)) return modules.get(source);

    var ready = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = source;
      script.async = true;
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error('Could not load interface preview: ' + source));
      };
      document.head.appendChild(script);
    });
    modules.set(source, ready);
    return ready;
  }

  function mount(placeholder) {
    if (mounted.has(placeholder)) return;
    mounted.add(placeholder);

    loadModule(placeholder.dataset.module).then(function () {
      var element = document.createElement(placeholder.dataset.element);
      var scenario = placeholder.dataset.scenario;
      var speed = placeholder.dataset.speed;

      if (scenario) element.setAttribute('scenario', scenario);
      // A source-template node can briefly retain {{ speed }}. The rendered
      // node receives its real value from support.js; use the normal default
      // only in that short interim state.
      if (speed) element.setAttribute('speed', speed.indexOf('{{') === -1 ? speed : '0.8');
      element.style.cssText = 'display:block;width:100%;height:100%';
      placeholder.replaceChildren(element);
    }).catch(function () {
      // Leave the layout intact if a preview resource is unavailable. The
      // linked case itself remains reachable and no broken error is shown.
      mounted.delete(placeholder);
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      mount(entry.target);
    });
  }, { root: null, rootMargin: '300px 0px', threshold: 0 });

  function observePlaceholder(placeholder) {
    if (observed.has(placeholder)) return;
    observed.add(placeholder);
    observer.observe(placeholder);
  }

  function toPlaceholder(node) {
    var elementName = node.getAttribute('component-from-global-scope');
    if (!supported.has(elementName)) return;

    var placeholder = document.createElement('div');
    placeholder.className = 'lazy-reel';
    placeholder.dataset.module = node.getAttribute('from');
    placeholder.dataset.element = elementName;
    placeholder.dataset.scenario = node.getAttribute('scenario') || '';

    // support.js evaluates this data attribute again in the rendered tree,
    // preserving the editor's configurable reel speed.
    var speed = node.getAttribute('speed');
    placeholder.dataset.speed = speed || '0.8';

    if (node.hasAttribute('style')) placeholder.setAttribute('style', node.getAttribute('style'));
    if (node.closest('.work-preview')) {
      placeholder.style.cssText += ';position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
    }

    node.replaceWith(placeholder);
    observePlaceholder(placeholder);
  }

  function replaceReels(root) {
    root.querySelectorAll('x-import[component-from-global-scope]').forEach(toPlaceholder);
  }

  function observeAddedNodes(nodes) {
    nodes.forEach(function (node) {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.matches('.lazy-reel')) observePlaceholder(node);
      node.querySelectorAll('.lazy-reel').forEach(observePlaceholder);
    });
  }

  // support.js starts its initial render on DOMContentLoaded. Registering
  // first guarantees the expensive imports are replaced before that pass.
  document.addEventListener('DOMContentLoaded', function () {
    replaceReels(document);

    // The DC runtime replaces its source template with a rendered DOM tree.
    // Watch that tree as well: observing only the original template nodes
    // would leave the real on-screen placeholders unobserved.
    var changes = new MutationObserver(function (records) {
      records.forEach(function (record) {
        observeAddedNodes(record.addedNodes);
      });
    });
    changes.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll('.lazy-reel').forEach(observePlaceholder);
  });
}());
