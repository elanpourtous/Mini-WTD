// public/assets/js/mwtd-tts.js
(function () {
  var btn = document.getElementById("tts-toggle");
  if (!btn) return;

  if (!("speechSynthesis" in window)) {
    btn.disabled = true;
    btn.title = "Lecture vocale non disponible sur ce navigateur.";
    return;
  }

  var synth = window.speechSynthesis;
  var isReading = false;
  var currentUtterance = null;

  function speakText(text) {
    if (!text || !text.trim()) return;
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = "fr-FR";
    currentUtterance.onend = function () {
      isReading = false;
      btn.setAttribute("aria-pressed", "false");
    };
    synth.speak(currentUtterance);
  }

  function getMainText() {
    var main = document.getElementById("main") || document.querySelector("main");
    if (!main) return document.body.innerText || "";
    return main.innerText || main.textContent || "";
  }

  btn.addEventListener("click", function () {
    if (isReading) {
      synth.cancel();
      isReading = false;
      btn.setAttribute("aria-pressed", "false");
      return;
    }

    var text = getMainText();
    if (!text) return;

    isReading = true;
    btn.setAttribute("aria-pressed", "true");
    speakText(text);
  });
})();
