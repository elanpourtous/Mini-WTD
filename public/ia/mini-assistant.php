<?php // Mini-WTD — Mini-Assistant IA (TTS/STT) ?>
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Mini-WTD · Mini-Assistant IA (TTS/STT)</title>
  <link rel="stylesheet" href="../assets/css/rgaa-accessible.css">
  <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
  <a class="skiplink" href="#main">Aller au contenu</a>

  <?php include __DIR__ . '/../includes/nav.html'; ?>

  <header class="container" role="banner">
    <h1>🧠 Mini-Assistant IA — Lecture & Dictée</h1>
    <p class="muted">TTS (lecture vocale) + STT (dictée). Compatible Chrome/Edge. Raccourci : <span class="kbd">Ctrl</span> + <span class="kbd">Entrée</span> pour lire.</p>
  </header>

  <main id="main" class="container grid" tabindex="-1" aria-labelledby="main-title">
    <h2 id="main-title" class="visually-hidden">Assistant vocal</h2>

    <!-- Lecture (TTS) -->
    <section class="card" aria-labelledby="tts-title">
      <h3 id="tts-title">🗣️ Lecture vocale (TTS)</h3>

      <label for="ttsText" class="required">Texte à lire</label>
      <textarea id="ttsText" rows="4" aria-describedby="ttsHelp">Bonjour, ceci est une démonstration de lecture vocale accessible avec Mini-WTD.</textarea>
      <p id="ttsHelp" class="form-hint">Astuce : <span class="kbd">Ctrl</span> + <span class="kbd">Entrée</span> lance la lecture.</p>

      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem">
        <label>Voix
          <select id="voiceSelect"></select>
        </label>
        <label>Vitesse (<span id="rateVal">1.0</span>)
          <input id="rate" type="range" min="0.5" max="2" step="0.1" value="1">
        </label>
        <label>Tonalité (<span id="pitchVal">1.0</span>)
          <input id="pitch" type="range" min="0" max="2" step="0.1" value="1">
        </label>
        <label>Volume (<span id="volVal">1.0</span>)
          <input id="volume" type="range" min="0" max="1" step="0.05" value="1">
        </label>
      </div>

      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.6rem">
        <button class="btn btn--primary" id="btnSpeak" type="button">▶️ Lire</button>
        <button class="btn" id="btnPause" type="button" disabled>⏸️ Pause</button>
        <button class="btn" id="btnResume" type="button" disabled>▶️ Reprendre</button>
        <button class="btn" id="btnStop" type="button" disabled>⏹️ Stop</button>
        <label class="pill"><input type="checkbox" id="chkAutoFocus"> Replacer le focus sur le texte</label>
      </div>

      <div id="ttsLive" class="alert" role="status" aria-live="polite" style="margin-top:.5rem">TTS prêt.</div>
    </section>

    <!-- Dictée (STT) -->
    <section class="card" aria-labelledby="stt-title">
      <h3 id="stt-title">🎙️ Dictée vocale (STT)</h3>
      <p class="muted">Nécessite Chrome/Edge (API <code>webkitSpeechRecognition</code>). Microphone requis.</p>

      <div style="display:flex;gap:.5rem;flex-wrap:wrap">
        <button class="btn btn--primary" id="btnRec" type="button">Démarrer</button>
        <button class="btn" id="btnRecStop" type="button" disabled>Arrêter</button>
        <label class="pill"><input type="checkbox" id="chkContinuous" checked> Continu</label>
        <label class="pill"><input type="checkbox" id="chkInterim" checked> Résultats intermédiaires</label>
        <label class="pill">Langue
          <select id="langSelect">
            <option value="fr-FR" selected>fr-FR</option>
            <option value="fr-CA">fr-CA</option>
            <option value="en-US">en-US</option>
            <option value="en-GB">en-GB</option>
            <option value="es-ES">es-ES</option>
            <option value="de-DE">de-DE</option>
          </select>
        </label>
      </div>

      <label for="sttOut">Texte dicté (live)</label>
      <textarea id="sttOut" rows="5" aria-live="polite" placeholder="Votre dictée vocale apparaîtra ici…"></textarea>

      <div id="sttLive" class="alert" role="status" aria-live="polite" style="margin-top:.5rem">STT prêt.</div>
    </section>

    <!-- Journal -->
    <section class="card" aria-labelledby="log-title">
      <h3 id="log-title">📝 Journal</h3>
      <div id="log" class="alert alert--info" role="status" aria-live="polite">Prêt.</div>
    </section>
  </main>

  <footer class="container footer">
    <small>© <?= date('Y') ?> Mini-WTD — Mini-Assistant IA</small>
  </footer>

  <script src="../assets/js/mini-ia.js" defer></script>
</body>
</html>
