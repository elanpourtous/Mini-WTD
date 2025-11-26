// assets/js/camera.js
(async function () {
  const video = document.getElementById("wtd-video");
  const captureBtn = document.getElementById("wtd-capture");
  const canvas = document.getElementById("wtd-canvas");

  if (!video) return;

  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (e) {
    console.error("Webcam inaccessible :", e);
    alert("Impossible d'accéder à la caméra. Vérifiez les permissions de votre navigateur.");
    return;
  }

  if (captureBtn && canvas) {
    const ctx = canvas.getContext("2d");

    captureBtn.addEventListener("click", () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      canvas.style.display = "block";
      alert("Capture réalisée. Vous pouvez l’utiliser pour expliquer vos besoins d’adaptation.");
    });
  }
})();
