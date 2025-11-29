// public/assets/js/mwtd-accessibility.js
(function () {
  var root = document.documentElement;
  var STORAGE_KEY = "mwtd_a11y_settings";

  var settings = {
    fontSize: 100,
    contrast: false,
    spacing: false
  };

  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      var parsed = JSON.parse(saved);
      Object.assign(settings, parsed);
    }
  } catch (e) {
    // ignore
  }

  function apply() {
    root.style.fontSize = settings.fontSize + "%";
    root.classList.toggle("mwtd-high-contrast", !!settings.contrast);
    root.classList.toggle("mwtd-large-spacing", !!settings.spacing);
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      // ignore
    }
  }

  apply();

  var buttons = document.querySelectorAll(".access-btn");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var action = btn.getAttribute("data-action");
      if (!action) return;

      if (action === "font+") {
        settings.fontSize = Math.min(settings.fontSize + 10, 180);
      } else if (action === "font-") {
        settings.fontSize = Math.max(settings.fontSize - 10, 70);
      } else if (action === "contrast") {
        settings.contrast = !settings.contrast;
      } else if (action === "spacing") {
        settings.spacing = !settings.spacing;
      } else if (action === "reset") {
        settings = { fontSize: 100, contrast: false, spacing: false };
      }

      apply();
      save();
    });
  });
})();
