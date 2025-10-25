<?php // Mini-WTD — Démo Accessibilité (RGAA) ?>
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Mini-WTD · Démo Accessibilité (RGAA)</title>
  <link rel="stylesheet" href="assets/css/rgaa-accessible.css">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <a class="skiplink" href="#main">Aller au contenu</a>
  <?php include 'includes/nav.html'; ?>

  <main id="main" class="container grid" tabindex="-1">
    <!-- Boutons & alertes -->
    <section class="card" aria-labelledby="sect-actions">
      <h2 id="sect-actions">Boutons & alertes</h2>
      <div class="stack">
        <div style="display:flex;gap:.5rem;flex-wrap:wrap">
          <button class="btn btn--primary" id="btnSuccess" type="button">Action réussie</button>
          <button class="btn" id="btnWarn" type="button">Avertissement</button>
          <button class="btn" id="btnError" type="button">Erreur</button>
        </div>
        <div id="live" class="alert" role="status" aria-live="polite">Zone de retour d’action.</div>
      </div>
    </section>

    <!-- Formulaire accessible -->
    <section class="card" aria-labelledby="sect-form">
      <h2 id="sect-form">Formulaire accessible</h2>
      <form class="stack" id="demoForm" novalidate>
        <label for="name" class="required">Votre nom</label>
        <input id="name" name="name" type="text" autocomplete="name" required>

        <label for="email" class="required">E-mail</label>
        <input id="email" name="email" type="email" autocomplete="email" required>

        <fieldset>
          <legend>Préférences</legend>
          <label class="pill"><input type="checkbox" id="chkContrast"> Contraste renforcé</label>
          <label class="pill"><input type="checkbox" id="chkReduceMotion"> Réduire les animations</label>
        </fieldset>

        <button class="btn btn--primary">Envoyer</button>
        <div id="formAlert" class="alert alert--warning" role="alert" hidden>
          Veuillez renseigner tous les champs requis.
        </div>
      </form>
    </section>

    <!-- Tableau accessible -->
    <section class="card" aria-labelledby="sect-table">
      <h2 id="sect-table">Tableau avec en-têtes</h2>
      <div class="stack">
        <table>
          <caption>Exemple de tableau (produits fictifs)</caption>
          <thead>
            <tr>
              <th scope="col">Produit</th>
              <th scope="col">Prix</th>
              <th scope="col">Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">Clavier accessible</th><td>49,90 €</td><td>En stock</td></tr>
            <tr><th scope="row">Casque audio</th><td>79,00 €</td><td>Faible</td></tr>
            <tr><th scope="row">Liseuse</th><td>129,00 €</td><td>Rupture</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Modale accessible -->
    <section class="card" aria-labelledby="sect-dialog">
      <h2 id="sect-dialog">Fenêtre modale (dialog)</h2>
      <button class="btn" id="openModal" type="button" aria-haspopup="dialog" aria-controls="demoDialog">
        Ouvrir la modale
      </button>
      <dialog id="demoDialog" aria-labelledby="dlgTitle" aria-describedby="dlgDesc">
        <form method="dialog" class="stack" style="min-width:min(90vw,420px);">
          <h3 id="dlgTitle">Exemple de modale accessible</h3>
          <p id="dlgDesc" class="muted">Navigation au clavier, focus piégé, fermeture par Échap ou bouton.</p>
          <label for="modalInput">Saisissez une note :</label>
          <input type="text" id="modalInput">
          <div style="display:flex;gap:.5rem;justify-content:flex-end">
            <button class="btn" value="cancel">Annuler</button>
            <button class="btn btn--primary" value="ok">Valider</button>
          </div>
        </form>
      </dialog>
    </section>
  </main>

  <footer class="container footer">
    <small>© <?= date('Y') ?> Mini-WTD — Démo RGAA</small>
  </footer>

  <script>
    // Boutons -> annonces live
    const $live = document.getElementById('live');
    document.getElementById('btnSuccess').addEventListener('click', () => {
      $live.className = 'alert alert--success'; $live.textContent = 'Action effectuée avec succès.';
    });
    document.getElementById('btnWarn').addEventListener('click', () => {
      $live.className = 'alert alert--warning'; $live.textContent = 'Attention : vérifiez vos paramètres.';
    });
    document.getElementById('btnError').addEventListener('click', () => {
      $live.className = 'alert alert--danger'; $live.textContent = 'Erreur : opération annulée.';
    });

    // Formulaire
    const $form = document.getElementById('demoForm');
    const $formAlert = document.getElementById('formAlert');
    $form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = $form.checkValidity();
      $formAlert.hidden = ok;
      if (ok) { $live.className = 'alert alert--success'; $live.textContent = 'Formulaire soumis avec succès.'; }
      else { $formAlert.textContent = 'Veuillez renseigner tous les champs requis.'; }
    });

    // Modale
    const dlg = document.getElementById('demoDialog');
    const opener = document.getElementById('openModal');
    const modalInput = document.getElementById('modalInput');
    opener.addEventListener('click', () => { dlg.showModal(); modalInput.focus(); });
    dlg.addEventListener('cancel', () => { opener.focus(); }); // Échap
    dlg.addEventListener('close', () => { opener.focus(); });

    // Préférences visuelles
    const chkContrast = document.getElementById('chkContrast');
    const chkReduce = document.getElementById('chkReduceMotion');
    chkContrast?.addEventListener('change', (e) => {
      document.documentElement.classList.toggle('contrast-boost', e.target.checked);
    });
    chkReduce?.addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-motion', e.target.checked ? 'reduce' : (localStorage.getItem('miniwtd_motion') || 'auto'));
    });
  </script>

  <style>
    /* Petites classes d’aide pour la démo */
    @media (prefers-reduced-motion: no-preference) {
      :root:not([data-motion="reduce"]) dialog[open] { animation: pop .14s ease-out; }
      @keyframes pop { from { transform: scale(.98); opacity: .6 } to { transform: scale(1); opacity: 1 } }
    }
  </style>
</body>
</html>
