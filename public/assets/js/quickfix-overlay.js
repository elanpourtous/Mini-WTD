// public/assets/js/quickfix-overlay.js
(function () {
  var FLAG_KEY = "mwtd_show_quickfix";

  function createBanner() {
    var banner = document.createElement("div");
    banner.className = "mwtd-quickfix-banner";
    banner.setAttribute("role", "status");
    banner.setAttribute("aria-live", "polite");
    banner.innerHTML =
      "<strong>Mini-WTD · Laboratoire public</strong> — page d’essai pour l’accessibilité (non contractuelle).";
    document.body.appendChild(banner);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createBanner);
  } else {
    createBanner();
  }

  // Permet de désactiver via la console : localStorage.setItem('mwtd_show_quickfix','0')
  try {
    var flag = localStorage.getItem(FLAG_KEY);
    if (flag === "0") {
      var existing = document.querySelector(".mwtd-quickfix-banner");
      if (existing) existing.remove();
    }
  } catch (e) {
    // rien
  }
})();
