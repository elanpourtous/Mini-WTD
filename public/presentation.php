<?php // Mini-WTD — Présentation ?>
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mini-WTD · Présentation</title>
  <link rel="stylesheet" href="assets/css/rgaa-accessible.css">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <a class="skiplink" href="#main">Aller au contenu</a>

  <?php include 'includes/nav.html'; ?>

  <main id="main" class="container" tabindex="-1" aria-labelledby="title">
    <header class="card" style="margin-top:1rem">
      <h1 id="title">🇫🇷 Mini-WTD — Présentation Work-Test-Demo</h1>
      <p class="muted">L’outil numérique accessible à tous — Made in France.</p>
    </header>

    <!-- DÉMARRAGE RAPIDE -->
    <section class="grid" aria-labelledby="quickstart">
      <h2 id="quickstart" class="visually-hidden">Démarrage rapide</h2>

      <article class="card">
        <h3>🔎 Tester un site (RGAA)</h3>
        <p>Analyse de titres, alt, liens, labels, landmarks, contraste (démo).</p>
        <a class="btn btn--primary" href="rgaa.php">Ouvrir l’audit</a>
      </article>

      <article class="card">
        <h3>🎨 Démo Accessibilité</h3>
        <p>Formulaire labellisé, tableau avec en-têtes, modale accessible, alertes live.</p>
        <a class="btn" href="demo-accessibilite.php">Lancer la démo</a>
      </article>

      <article class="card">
        <h3>🧠 Mini-Assistant IA</h3>
        <p>Lecture (TTS) & dictée (STT). Idéal pour la prise de notes accessible.</p>
        <a class="btn" href="ia/mini-assistant.html">Essayer l’assistant</a>
      </article>
    </section>

    <hr aria-hidden="true" style="margin:1.2rem 0">

    <!-- MODES -->
    <section class="grid" aria-labelledby="modes">
      <h2 id="modes">Modes d’utilisation</h2>

      <article class="card">
        <h3>🖥️ Mode Présentation</h3>
        <p>Interface épurée pour démos : gros boutons, contraste élevé, peu de distractions.</p>
        <ul><li>Focus visible</li><li>Composants ARIA</li><li>Raccourcis clavier</li></ul>
        <a class="btn" href="demo-accessibilite-present.php">Ouvrir le mode Présentation</a>
      </article>

      <article class="card">
        <h3>🧩 Mode Standard</h3>
        <p>Expérience complète, idéale pour l’évaluation et la formation.</p>
      </article>

      <article class="card">
        <h3>🤫 Bureau silencieux</h3>
        <p>Sans son, animations réduites, notifications minimales.</p>
      </article>
    </section>

    <!-- ACCESSIBILITÉ MAXIMALE -->
    <section class="card" id="access-max-panel" aria-labelledby="a11y-title" style="margin-top:1rem">
      <h2 id="a11y-title">Accessibilité maximale</h2>
      <p>Active tous les réglages renforcés : <strong>thème sombre</strong>, <strong>contraste élevé</strong>, <strong>cibles ≥44px</strong>, <strong>animations réduites</strong>.</p>

      <div class="stack" role="group" aria-label="Commandes Accessibilité maximale" style="gap:.6rem">
        <div style="display:flex;flex-wrap:wrap;gap:.6rem">
          <button class="btn btn--primary" id="btnA11yMaxOn"  type="button">Activer</button>
          <button class="btn"              id="btnA11yMaxOff" type="button">Désactiver</button>
        </div>
        <div id="a11yMaxLive" class="alert" role="status" aria-live="polite">Prêt.</div>
      </div>

      <ul class="list" style="margin-top:.6rem">
        <li><strong>Thème sombre</strong> (lisibilité)</li>
        <li><strong>Focus très visible</strong></li>
        <li><strong>Cibles tactiles élargies</strong></li>
        <li><strong>Réduction d’animations</strong> (respect système + override)</li>
      </ul>
    </section>

    <!-- RACCOURCIS -->
    <section class="card" aria-labelledby="shortcuts" style="margin-top:1rem">
      <h2 id="shortcuts">Raccourcis & aide</h2>
      <ul>
        <li><span class="kbd">Ctrl</span> + <span class="kbd">Entrée</span> : lecture vocale (assistant)</li>
        <li><span class="kbd">Tab</span> / <span class="kbd">Maj+Tab</span> : navigation au clavier</li>
        <li><span class="kbd">Échap</span> : fermer une modale</li>
      </ul>
      <ul>
        <li><a href="status.php">Status local</a></li>
        <li><a href="README.md">Documentation</a></li>
      </ul>
    </section>
  </main>

  <footer class="container footer">
    <small>© <?= date('Y') ?> Mini-WTD — Présentation</small>
  </footer>

  <!-- Script du panneau Accessibilité maximale -->
  <script>
  (function(){
    const html   = document.documentElement;
    const live   = document.getElementById('a11yMaxLive');
    const onBtn  = document.getElementById('btnA11yMaxOn');
    const offBtn = document.getElementById('btnA11yMaxOff');

    const THEME_KEY  = 'miniwtd_theme';   // 'light' | 'dark'
    const MOTION_KEY = 'miniwtd_motion';  // 'auto' | 'reduce'
    const CLASS_MAX  = 'a11y-max';        // cibles + focus
    const CLASS_CB   = 'contrast-boost';  // contraste fort

    function say(msg, ok=true){
      if (!live) return;
      live.className = 'alert ' + (ok ? 'alert--success' : 'alert--warning');
      live.textContent = msg;
    }

    function applyMax(on){
      // Thème + mouvement
      localStorage.setItem(THEME_KEY, on ? 'dark' : 'light');
      html.setAttribute('data-theme', on ? 'dark' : 'light');
      localStorage.setItem(MOTION_KEY, on ? 'reduce' : 'auto');
      html.setAttribute('data-motion', on ? 'reduce' : 'auto');

      // Classes d’accessibilité
      html.classList.toggle(CLASS_MAX, on);
      html.classList.toggle(CLASS_CB, on);

      // Journal (si helper présent)
      window.logA11y && window.logA11y('access_max', on ? 'on' : 'off');
      say(on ? 'Accessibilité maximale activée.' : 'Accessibilité maximale désactivée.');
    }

    onBtn?.addEventListener('click', ()=> applyMax(true));
    offBtn?.addEventListener('click',()=> applyMax(false));

    // Appliquer état initial si déjà activé
    const savedTheme  = localStorage.getItem(THEME_KEY);
    const savedMotion = localStorage.getItem(MOTION_KEY);
    const wasOn = (savedTheme==='dark') || (savedMotion==='reduce') || html.classList.contains(CLASS_MAX);
    if (wasOn) applyMax(true);
  })();
  </script>

  <!-- Les scripts communs (theme/motion/badge/log) sont déjà chargés par includes/nav.html -->
</body>
</html>
