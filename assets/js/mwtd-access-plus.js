/* === MODULE ACCESSIBILITÉ++ — MINI-WTD — VERSION PRO PACKAGÉE === */

(function () {

  const body = document.body;

  function toggleClass(cls) {
    body.classList.toggle(cls);
  }

  // === 1. MOTEUR VOCAL ===
  const mwtdVoice = {
    rate: 1,
    pitch: 1,
    mode: "normal",

    setMode(mode) {
      this.mode = mode;
      if (mode === "lent") { this.rate = 0.7; this.pitch = 1; }
      else if (mode === "tres-lent") { this.rate = 0.45; this.pitch = 1; }
      else if (mode === "cognitif") { this.rate = 0.6; this.pitch = 0.85; }
      else if (mode === "malentendant") { this.rate = 0.9; this.pitch = 1.2; }
      else { this.rate = 1; this.pitch = 1; }
    },

    read(text) {
      if (!("speechSynthesis" in window)) return;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "fr-FR";
      utter.rate = this.rate;
      utter.pitch = this.pitch;
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
    }
  };

  window.mwtdVoice = mwtdVoice;

  // === 2. SOUS-TITRES LIVE ===
  let recognition = null;
  const subtitleBox = document.getElementById("mwtd-subtitles");

  function initRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    recognition = new SR();
    recognition.lang = "fr-FR";
    recognition.interimResults = true;

    recognition.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join("");
      subtitleBox.innerText = text;
    };

    recognition.onstart = () => subtitleBox.classList.add("is-visible");
    recognition.onend = () => subtitleBox.classList.remove("is-visible");
  }

  function toggleSubtitles() {
    if (!recognition) initRecognition();
    if (!recognition) return alert("Sous-titres non disponibles ici.");
    subtitleBox.classList.contains("is-visible") ?
      recognition.stop() : recognition.start();
  }

  // === 3. PANNEAU ACCESS++ ===
  const panel = document.getElementById("a11y-plus-panel");
  const trigger = document.getElementById("btn-a11y-plus");

  if (trigger && panel) {
    trigger.addEventListener("click", () => {
      panel.classList.toggle("is-open");
    });
  }

  // Modes
  document.getElementById("a11y-mode-dys")?.addEventListener("change", () => {
    toggleClass("mode-dyslexie");
  });
  document.getElementById("a11y-mode-cog")?.addEventListener("change", () => {
    toggleClass("mode-cognitif");
  });
  document.getElementById("a11y-mode-contrast")?.addEventListener("change", () => {
    toggleClass("mode-haut-contraste");
  });
  document.getElementById("a11y-mode-subtitles")?.addEventListener("change", toggleSubtitles);

  document.getElementById("a11y-voice-profile")?.addEventListener("change", (e) => {
    mwtdVoice.setMode(e.target.value);
  });

  // === 4. MODE RÉUNION PRO ===
  window.enableMeetingMode = function () {
    toggleClass("mode-haut-contraste");
    toggleClass("mode-cognitif");
    mwtdVoice.setMode("lent");
    toggleSubtitles();
    alert("Mode réunion professionnelle activé.");
  };

  // === 5. DÉMO CHOC ===
  window.demoChoc = function () {
    mwtdVoice.setMode("lent");
    toggleClass("mode-haut-contraste");
    toggleSubtitles();
    mwtdVoice.read("Démonstration Accessibilité+. Mode non-voyant, malentendant et cognitif activé.");
  };

  // === 6. SYNTHÈSE DIRIGEANT ===
  window.generateManagerSummary = function () {
    const msg =
      "Synthèse Accessibilité++ :\n" +
      "• Sous-titres live\n" +
      "• Mode cognition pour T21 / IMC\n" +
      "• Mode dyslexie\n" +
      "• Voix adaptée\n" +
      "• Demande discrète d'adaptation\n" +
      "• Aucune donnée stockée\n";
    alert(msg);
    mwtdVoice.read(msg);
  };

  // === 7. TRANSPARENCE ENTREPRISE ===
  window.showEnterpriseInfo = function () {
    alert(
      "Transparence Mini-WTD :\n\n" +
      "• Aucun stockage local\n" +
      "• Aucune donnée envoyée sans consentement\n" +
      "• 100% RGAA-friendly\n" +
      "• Module non-intrusif pour salariés"
    );
  };

  // === 8. FORMULAIRE DEMANDE SPÉCIFIQUE ===
  const formToggle = document.getElementById("a11y-request-toggle");
  const requestForm = document.getElementById("a11y-request-form");

  formToggle?.addEventListener("click", () => {
    requestForm.classList.toggle("is-open");
  });

  document.getElementById("a11y-request-submit")?.addEventListener("click", (e) => {
    e.preventDefault();

    const data = {
      type: document.getElementById("a11y-request-type")?.value || "",
      contexte: document.getElementById("a11y-request-context")?.value.trim() || "",
      besoin: document.getElementById("a11y-request-need")?.value.trim() || "",
      email: document.getElementById("a11y-request-email")?.value.trim() || "",
    };

    if (!data.besoin) return alert("Merci de décrire votre besoin.");

    if (!window.emailjs) {
      console.log("Demande interne :", data);
      return alert("Version démo : aucune donnée envoyée.");
    }

    emailjs.send("service_miniwtd", "template_demande_a11y", {
      type_handicap: data.type,
      contexte: data.contexte,
      besoin: data.besoin,
      email_contact: data.email
    }).then(() => {
      alert("Demande envoyée au référent accessibilité.");
      requestForm.classList.remove("is-open");
    });
  });

})();
