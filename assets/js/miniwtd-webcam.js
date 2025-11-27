/* =========================================
   Mini-WTD · Webcam posture & environnement
   Version safe : capture locale uniquement, pas de stockage
   ========================================= */

(function () {
  const video = document.getElementById('mwtd-webcam');
  const btnStart = document.getElementById('mwtd-webcam-start');
  const btnStop = document.getElementById('mwtd-webcam-stop');
  const status = document.getElementById('mwtd-webcam-status');

  if (!video || !btnStart || !btnStop || !status) return;

  let currentStream = null;

  function setStatus(text) {
    status.textContent = text;
  }

  async function startWebcam() {
    // Si déjà actif, on ne redemande pas
    if (currentStream) {
      setStatus("La caméra est déjà activée.");
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("La caméra n’est pas disponible dans ce navigateur.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      currentStream = stream;
      video.srcObject = stream;
      setStatus("Caméra activée. Le flux reste local sur cet appareil.");
    } catch (err) {
      console.error("Erreur webcam Mini-WTD :", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setStatus("Accès à la caméra refusé par l’utilisateur.");
      } else if (err.name === "NotFoundError" || err.name === "OverconstrainedError") {
        setStatus("Aucun périphérique caméra compatible détecté.");
      } else {
        setStatus("Impossible d’activer la caméra. Vérifiez les paramètres du navigateur.");
      }
    }
  }

  function stopWebcam() {
    if (!currentStream) {
      setStatus("La caméra est déjà désactivée.");
      return;
    }

    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
    video.srcObject = null;
    setStatus("La caméra est désactivée. Aucun flux n’est enregistré ni conservé.");
  }

  btnStart.addEventListener('click', startWebcam);
  btnStop.addEventListener('click', stopWebcam);

  // Sécurité : on coupe tout si la page est quittée
  window.addEventListener('beforeunload', stopWebcam);
})();
