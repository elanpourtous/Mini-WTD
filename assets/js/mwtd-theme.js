// public/assets/js/mwtd-theme.js
(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  var STORAGE_KEY = "mwtd_theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (btn) {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  }

  function getPreferred() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch (e) {}
    if (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  var current = getPreferred();
  applyTheme(current);

  if (!btn) return;

  btn.addEventListener("click", function () {
    current = current === "dark" ? "light" : "dark";
    applyTheme(current);
    try {
      localStorage.setItem(STORAGE_KEY, current);
    } catch (e) {}
  });
})();
