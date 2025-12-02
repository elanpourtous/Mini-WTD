// Mini-WTD · Analyse IA du bilan (offline helper + hook pour IA externe)
(function () {
  const form = document.getElementById("form-bilan");
  const btn = document.getElementById("btn-ia");
  const outSection = document.getElementById("ia-result");
  const outContent = document.getElementById("ia-content");
  const langSelect = document.getElementById("ia-lang");

  if (!form || !btn || !outSection || !outContent) return;

  function collectData() {
    const fields = form.querySelectorAll("input, textarea, select");
    const data = [];
    fields.forEach(el => {
      if (!el.id) return;
      const label = form.querySelector('label[for="' + el.id + '"]');
      const title = label ? label.innerText.trim() : el.name || el.id;
      data.push({ id: el.id, title, value: el.value.trim() });
    });
    return data;
  }

  function buildSummaryFR(data) {
    const find = id => (data.find(d => d.id === id) || {}).value || "(non renseigné)";
    const personne = find("bilan-personne");
    const poste = find("bilan-poste");
    const service = find("bilan-service");
    const taches = find("bilan-taches");
    const diffic = find("bilan-difficultes");
    const impacts = find("bilan-impacts");
    const urgence = find("bilan-urgence");
    const materiel = find("bilan-materiel");
    const orga = find("bilan-organisation");
    const num = find("bilan-numerique");
    const acteurs = find("bilan-acteurs");
    const decisions = find("bilan-decisions");

    return [
      "1. Situation actuelle",
      "La personne concernée : " + personne + ".",
      "Poste / fonction : " + poste + ", au sein du service / site : " + service + ".",
      "",
      "Les tâches principales décrites sont :",
      taches,
      "",
      "2. Contraintes et difficultés",
      "Les difficultés rapportées dans la situation actuelle sont :",
      diffic,
      "",
      "Ces éléments entraînent les impacts suivants sur le travail, la santé, l’équipe ou les usagers :",
      impacts,
      "",
      "Niveau d’urgence perçu : " + urgence + ".",
      "",
      "3. Pistes d’aménagement envisagées",
      "Aménagements matériels :",
      materiel,
      "",
      "Aménagements organisationnels / horaires :",
      orga,
      "",
      "Aménagements numériques / logiciels :",
      num,
      "",
      "4. Acteurs et décisions",
      "Acteurs à associer :",
      acteurs,
      "",
      "Décisions ou prochaines étapes déjà envisagées :",
      decisions,
      "",
      "5. Recommandations de lecture pour un RH / médecin du travail",
      "- Ce bilan décrit une situation de travail réelle, avec ses contraintes et les ressentis du salarié.",
      "- Les pistes d’aménagement peuvent être testées dans le cadre d’un essai encadré (quelques semaines à quelques mois).",
      "- Il est recommandé d’associer les acteurs cités, et de prévoir un point d’étape daté pour réévaluer la situation.",
      "",
      "Cette synthèse ne remplace pas un avis médical ou une décision RH, mais elle fournit une base structurée pour le dialogue."
    ].join("\\n");
  }

  function buildSummaryMG(data) {
    const find = id => (data.find(d => d.id === id) || {}).value || "(tsy voasoratra)";
    const personne = find("bilan-personne");
    const poste = find("bilan-poste");
    const service = find("bilan-service");
    const taches = find("bilan-taches");
    const diffic = find("bilan-difficultes");
    const impacts = find("bilan-impacts");
    const urgence = find("bilan-urgence");
    const materiel = find("bilan-materiel");
    const orga = find("bilan-organisation");
    const num = find("bilan-numerique");
    const acteurs = find("bilan-acteurs");
    const decisions = find("bilan-decisions");

    return [
      "1. Toe-javatra ankehitriny",
      "Olona voakasika : " + personne + ".",
      "Asa sy andraikitra : " + poste + ", ao amin’ny sampana na toerana : " + service + ".",
      "",
      "Asa atao matetika :",
      taches,
      "",
      "2. Fahasarotana sy fetran’ny asa",
      "Fahasahiranana tsapan’ny olona amin’izao toe-javatra izao :",
      diffic,
      "",
      "Vokatry ny fahasahiranana amin’ny asa, ny fahasalamana, ny ekipa na ny mpanjifa :",
      impacts,
      "",
      "Hakitroky ny filàna fandraisana andraikitra : " + urgence + ".",
      "",
      "3. Hevitra fanitsiana",
      "Fitaovana sy fanitsiana ara-batana :",
      materiel,
      "",
      "Fanitsiana fandaminana sy ora fiasana :",
      orga,
      "",
      "Fanitsiana nomerika na rindranasa :",
      num,
      "",
      "4. Olona tokony ho tafiditra sy dingana manaraka",
      "Olona, sampana na rafitra tokony ho tafiditra :",
      acteurs,
      "",
      "Dingana efa noeritreretina na fanapahan-kevitra voalohany :",
      decisions,
      "",
      "5. Torohevitra ho an’ny mpampiasa, HR na dokotera mpanara-maso",
      "- Ity famintinana ity dia manazava ny asa tena atao sy ny olana tsapan’ny olona.",
      "- Ny fanitsiana dia azo andramana amin’ny fotoana voafetra, miaraka amin’ny fanaraha-maso.",
      "- Tsara raha misy fotoana voatondro hanavaozana ny fijerena ny toe-javatra.",
      "",
      "Tsy manolo ny hevitra ara-pitsaboana na fanapahan-kevitra ofisialy izany, fa manome fototra mazava ho an’ny fifampiresahana."
    ].join("\\n");
  }

  function buildSummaryEN(data) {
    const find = id => (data.find(d => d.id === id) || {}).value || "(not provided)";
    const personne = find("bilan-personne");
    const poste = find("bilan-poste");
    const service = find("bilan-service");
    const taches = find("bilan-taches");
    const diffic = find("bilan-difficultes");
    const impacts = find("bilan-impacts");
    const urgence = find("bilan-urgence");
    const materiel = find("bilan-materiel");
    const orga = find("bilan-organisation");
    const num = find("bilan-numerique");
    const acteurs = find("bilan-acteurs");
    const decisions = find("bilan-decisions");

    return [
      "1. Current situation",
      "Person concerned: " + personne + ".",
      "Job / position: " + poste + ", in department / site: " + service + ".",
      "",
      "Main tasks mentioned:",
      taches,
      "",
      "2. Constraints and difficulties",
      "Reported difficulties in the current situation:",
      diffic,
      "",
      "These elements have the following impacts on work, health, the team or users:",
      impacts,
      "",
      "Perceived level of urgency: " + urgence + ".",
      "",
      "3. Proposed adjustments",
      "Material adjustments:",
      materiel,
      "",
      "Organisational / scheduling adjustments:",
      orga,
      "",
      "Digital / software adjustments:",
      num,
      "",
      "4. Stakeholders and decisions",
      "Stakeholders to involve:",
      acteurs,
      "",
      "Decisions already considered or next steps:",
      decisions,
      "",
      "5. Reading guide for HR / occupational physician",
      "- This summary describes a real work situation, with constraints and the employee’s perspective.",
      "- The suggested adjustments can be tested through a time-limited trial period.",
      "- It is recommended to involve the identified stakeholders and set a review date.",
      "",
      "This synthesis does not replace medical advice or HR decisions, but offers a structured basis for dialogue."
    ].join("\\n");
  }

  function buildSummary(lang, data) {
    if (lang === "mg") return buildSummaryMG(data);
    if (lang === "en") return buildSummaryEN(data);
    return buildSummaryFR(data);
  }

  btn.addEventListener("click", function () {
    const data = collectData();
    const lang = langSelect ? langSelect.value : "fr";

    if (window.miniWTDExternalIA && typeof window.miniWTDExternalIA.generate === "function") {
      outContent.textContent = "Analyse IA en cours…";
      Promise.resolve(window.miniWTDExternalIA.generate({ lang, data }))
        .then(function (txt) {
          outContent.textContent = txt || buildSummary(lang, data);
          outSection.style.display = "block";
        })
        .catch(function () {
          outContent.textContent = buildSummary(lang, data);
          outSection.style.display = "block";
        });
    } else {
      const txt = buildSummary(lang, data);
      outContent.textContent = txt;
      outSection.style.display = "block";
    }
  });
})();
