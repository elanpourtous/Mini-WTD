/*  Mini-WTD — Module webcam (démo)
    Fichier : assets/js/camera.js

    Objectif :
    - Montrer une scène de travail pour discuter d’adaptations.
    - Ne JAMAIS faire de diagnostic médical ni de scoring automatique.
*/

(function () {
  const startBtn = document.getElementById("mwt-webcam-start");
  const stopBtn = document.getElementById("mwt-webcam-stop");
  const video = document.getElementById("mwt-webcam-video");
  const panel = document.getElementById("mwt-chat-panel");

  if (!startBtn || !stopBtn || !video) {
    console.warn("[Mini-WTD] Webcam : éléments HTML manquants.");
    return;
  }

  // Région live pour les lecteurs d’écran
  const liveRegion = document.createElement("div");
  liveRegion.className = "sr-only";
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  (panel || document.body).appendChild(liveRegion);

  let stream = null;

  async function startWebcam() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(
          "Votre navigateur ne permet pas d’utiliser la webcam avec cette démo. " +
            "Essayez avec une version plus récente de Firefox, Chrome ou Edge."
        );
        return;
      }

      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      video.srcObject = stream;
      video.style.display = "block";
      video.removeAttribute("aria-hidden");

      console.log("[Mini-WTD] Webcam active (démo).");
      liveRegion.textContent =
        "Webcam activée. L’image sert uniquement de support pour discuter des adaptations du poste, " +
        "pas pour poser un diagnostic médical.";

      // Si l’utilisateur a activé la préférence « réduire les animations », on reste discret
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (!prefersReducedMotion) {
        video.style.transition = "opacity 0.3s ease";
        video.style.opacity = "1";
      }
    } catch (err) {
      console.error("[Mini-WTD] Impossible d’activer la webcam :", err);
      alert(
        "Impossible d’accéder à la webcam. Vérifiez les autorisations du navigateur " +
          "ou les paramètres de sécurité de votre appareil."
      );
      liveRegion.textContent =
        "Erreur : la webcam n’a pas pu être activée. Vérifiez les autorisations.";
    }
  }

  function stopWebcam() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    video.srcObject = null;
    video.style.display = "none";
    video.setAttribute("aria-hidden", "true");

    console.log("[Mini-WTD] Webcam stoppée.");
    liveRegion.textContent =
      "Webcam arrêtée. Les images ne doivent être conservées que si tout le monde est d’accord " +
      "et uniquement pour travailler sur les adaptations au poste.";
  }

  startBtn.addEventListener("click", function () {
    startWebcam();
  });

  stopBtn.addEventListener("click", function () {
    stopWebcam();
  });

  // On coupe la webcam si l’onglet est masqué ou si la page est fermée
  window.addEventListener("beforeunload", function () {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden" && stream) {
      stopWebcam();
    }
  });
})();
