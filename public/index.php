<?php
// public/index.php
// Page d'accueil Mini-WTD (version PHP pour serveur local / intranet)
?>
<!doctype html>
<html lang="fr">
<head>
  <!-- Métadonnées de base -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mini-WTD · Work-Test-Demo</title>

  <meta name="description"
        content="Mini-WTD — Work-Test-Demo : démo d’accessibilité, formulaires RGAA, assistant IA, lecture vocale et outils pédagogiques.">
  <meta name="theme-color" content="#0b8457">

  <!-- CSS principaux -->
  <link rel="stylesheet" href="assets/css/rgaa-accessible.css">
  <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>
  <!-- Lien d’évitement clavier -->
  <a class="skip-link" href="#main">Aller directement au contenu</a>

  <!-- En-tête / navigation (adapte le chemin selon où est ton fichier nav.html) -->
  <?php
    // 👉 Si ton dossier "includes" est à côté de "public" à la racine du projet :
    // include __DIR__ . '/../includes/nav.html';

    // 👉 Si ton dossier "includes" est DANS "public/includes" :
    include __DIR__ . '/includes/nav.html';
  ?>

  <!-- Contenu principal -->
  <main id="main"
        class="container"
        role="main"
        tabindex="-1"
        aria-labelledby="page-title">

    <!-- Bloc d’accueil -->
    <header class="card" style="margin-top:1rem">
      <h1 id="page-title">🇫🇷 Mini-WTD — Work-Test-Demo</h1>
      <p class="muted">
        Outil d’entraînement et de démonstration <strong>accessible</strong>, pensé pour les tests,
        la formation et les simulations en situation de handicap.
      </p>
    </header>

    <!-- Actions rapides -->
    <section class="grid" aria-labelledby="actions-title" style="margin-top:1rem">
      <h2 id="actions-title" class="visually-hidden">Actions rapides</h2>

      <article class="card">
        <h3>📖 Présentation</h3>
        <p>Structure générale, repères RGAA, modes d’affichage et logiques d’épreuves.</p>
        <a class="btn btn--primary" href="presentation.php">Voir la présentation</a>
      </article>

      <article class="card">
        <h3>🎨 Démo accessibilité</h3>
        <p>Formulaire labellisé, messages d’erreur, tableau avec en-têtes, modale accessible.</p>
        <a class="btn" href="demo-accessibilite.php">Lancer la démo</a>
      </article>

      <article class="card">
        <h3>🖥️ Mode Présentation</h3>
        <p>Grosses cibles cliquables, contraste fort, idéal pour projection en salle.</p>
        <a class="btn" href="demo-accessibilite-present.php">Ouvrir le mode Présentation</a>
      </article>

      <article class="card">
        <h3>🔎 Audit RGAA</h3>
        <p>Analyse de page (titres, alt, labels, landmarks, liens) – démo pédagogique.</p>
        <a class="btn" href="rgaa.php">Ouvrir l’audit</a>
      </article>

      <article class="card">
        <h3>🧠 Mini-assistant IA</h3>
        <p>Lecture vocale & dictée pour prise de notes et consignes accessibles.</p>
        <a class="btn" href="ia/mini-assistant.html">Essayer l’assistant</a>
      </article>
    </section>

    <!-- Raccourcis et accessibilité -->
    <section class="card" aria-labelledby="a11y-shortcuts" style="margin-top:1rem">
      <h2 id="a11y-shortcuts">Accessibilité & raccourcis</h2>
      <ul>
        <li><span class="kbd">Tab</span> / <span class="kbd">Maj+Tab</span> : navigation au clavier</li>
        <li><span class="kbd">Entrée</span> ou <span class="kbd">Espace</span> : activer un bouton ou un lien</li>
        <li><span class="kbd">Échap</span> : fermer une boîte de dialogue (modale)</li>
        <li><span class="kbd">Ctrl</span> + <span class="kbd">Entrée</span> : lancer la lecture vocale (si activée dans l’outil)</li>
      </ul>
      <p class="muted">
        Astuce : tu peux combiner les réglages (contraste, taille de texte, espacement) pour créer un
        <strong>profil d’accessibilité</strong> adapté à chaque participant.
      </p>
    </section>
  </main>

  <!-- Pied de page -->
  <footer class="container footer">
    <small>
      © <?= date('Y') ?> Mini-WTD — Work-Test-Demo · Élan pour tous
    </small>
  </footer>

  <!-- Scripts éventuels de la home (si tu en as) -->
  <!--
  <script src="assets/js/accessibilite.js" defer></script>
  <script src="assets/js/home.js" defer></script>
  -->
</body>
</html>
