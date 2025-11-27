/* =========================================
   Mini-WTD · Bilan d’aménagement
   Génération de la synthèse texte côté navigateur
   ========================================= */

(function () {
  const form = document.getElementById('mwtd-form-bilan');
  const resultBox = document.getElementById('mwtd-bilan-resultat');

  if (!form || !resultBox) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Récup des champs
    const contexte = document.getElementById('bilan-contexte');
    const taches = document.getElementById('bilan-taches');
    const difficulte = document.getElementById('bilan-difficultes');
    const adaptations = document.getElementById('bilan-adaptations');
    const pistes = document.getElementById('bilan-pistes');
    const urgence = document.getElementById('bilan-urgence');

    // Validation minimale des champs obligatoires
    const requiredFields = [contexte, taches, difficulte];
    for (const field of requiredFields) {
      if (field && !field.value.trim()) {
        field.focus();
        alert("Merci de compléter les champs obligatoires avant de générer le bilan.");
        return;
      }
    }

    const contexteTxt = contexte ? contexte.value.trim() : "";
    const tachesTxt = taches ? taches.value.trim() : "";
    const difficulteTxt = difficulte ? difficulte.value.trim() : "";
    const adaptationsTxt = adaptations ? adaptations.value.trim() : "";
    const pistesTxt = pistes ? pistes.value.trim() : "";
    const urgenceVal = urgence ? urgence.value : "";

    let urgenceLabel = "";
    if (urgenceVal) {
      const map = {
        "1": "1 — À surveiller",
        "2": "2 — À traiter dans les prochains mois",
        "3": "3 — À traiter dans le mois",
        "4": "4 — Situation critique / à sécuriser immédiatement"
      };
      urgenceLabel = map[urgenceVal] || "";
    }

    // Construction de la synthèse
    let html = "";

    html += '<h3 class="mwtd-card-title">Synthèse de la situation</h3>';
    html += '<p class="mwtd-lead"><strong>Contexte du poste :</strong><br>' +
      escapeHtml(contexteTxt) + '</p>';

    html += '<p class="mwtd-lead"><strong>Tâches principales :</strong><br>' +
      escapeHtml(tachesTxt) + '</p>';

    html += '<p class="mwtd-lead"><strong>Difficultés observées :</strong><br>' +
      escapeHtml(difficulteTxt) + '</p>';

    if (adaptationsTxt) {
      html += '<p class="mwtd-lead"><strong>Adaptations déjà en place :</strong><br>' +
        escapeHtml(adaptationsTxt) + '</p>';
    }

    if (pistesTxt) {
      html += '<p class="mwtd-lead"><strong>Pistes d’aménagement envisagées :</strong><br>' +
        escapeHtml(pistesTxt) + '</p>';
    }

    if (urgenceLabel) {
      html += '<p class="mwtd-lead"><strong>Niveau d’urgence :</strong> ' +
        '<span class="mwtd-chip mwtd-pill-warning">' + escapeHtml(urgenceLabel) + '</span></p>';
    }

    html += '<p class="mwtd-tagline">Ce bilan n’est pas un avis médical. ' +
      'Il sert de support d’échange avec la RH, le référent handicap et la médecine du travail.</p>';

    resultBox.innerHTML = html;
  });

  // Petite fonction utilitaire pour éviter l’injection HTML
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
