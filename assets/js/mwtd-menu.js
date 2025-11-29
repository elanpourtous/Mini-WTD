// public/assets/js/mwtd-menu.js
(function () {
  var toggle = document.getElementById("menu-toggle");
  var nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  function setOpen(isOpen) {
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      nav.removeAttribute("hidden");
    } else {
      nav.setAttribute("hidden", "hidden");
    }
  }

  // état initial
  setOpen(false);

  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  // Fermer le menu si on resize très large
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 992) {
      setOpen(false);
    }
  });
})();
