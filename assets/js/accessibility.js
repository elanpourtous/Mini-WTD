/* =========================================
   Mini-WTD · Accessibilité visuelle 2025
   - Taille de police
   - Contraste renforcé
   - Espacement augmenté
   Préférences mémorisées en localStorage
   ========================================= */

(function () {
  const root = document.documentElement;
  const STORAGE_KEY = 'mwtdAccessibilitySettings';
  const buttons = document.querySelectorAll('[data-action]');

  if (!buttons.length) return;

  const defaultSettings = {
    fontSize: 100,      // en %
    contrast: false,    // .high-contrast
    spacing: false      // .large-spacing
  };

  let settings;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    settings = saved ? JSON.parse(saved) : { ...defaultSettings };
  } catch (e) {
    settings = { ...defaultSettings };
  }

  applySettings();

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      switch (action) {
        case 'font+':
          settings.fontSize = Math.min(settings.fontSize + 10, 180);
          break;
        case 'font-':
          settings.fontSize = Math.max(settings.fontSize - 10, 80);
          break;
        case 'contrast':
          settings.contrast = !settings.contrast;
          break;
        case 'spacing':
          settings.spacing = !settings.spacing;
          break;
        default:
          return;
      }
      applySettings();
      saveSettings();
    });
  });

  function applySettings() {
    root.style.fontSize = settings.fontSize + '%';

    root.classList.toggle('high-contrast', !!settings.contrast);
    root.classList.toggle('large-spacing', !!settings.spacing);
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      // on ignore si stockage désactivé
    }
  }
})();
