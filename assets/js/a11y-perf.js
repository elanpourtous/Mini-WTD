// public/assets/js/a11y-perf.js
(function () {
  if (!window.performance || !performance.timing) return;

  window.addEventListener("load", function () {
    try {
      var timing = performance.timing;
      var readyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
      var loadTime = timing.loadEventEnd - timing.navigationStart;

      console.log("[Mini-WTD][Perf] DOM prêt en " + readyTime + " ms");
      console.log("[Mini-WTD][Perf] Page chargée en " + loadTime + " ms");

      document.documentElement.setAttribute("data-mwtd-dom-ready", readyTime);
      document.documentElement.setAttribute("data-mwtd-load", loadTime);
    } catch (e) {
      console.warn("[Mini-WTD][Perf] erreur mesure", e);
    }
  });
})();
