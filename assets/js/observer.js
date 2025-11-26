/*  Mini-WTD — Assistant d’observation / adaptation + mini compte rendu
    Fichier : assets/js/observer.js

    ⚠️ Important :
    - AUCUNE analyse automatique d’image.
    - Les photos servent uniquement de support à l’observateur.
    - L’outil génère un texte d’aide à la décision, pas une décision.
*/

(function () {
  const form = document.getElementById("mwt-observer-form");
  const resultBox = document.getElementById("mwt-observer-result");

  if (!form || !resultBox) {
    console.warn("[Mini-WTD] Assistant d’observation : formulaire non trouvé.");
    return;
  }

  function getCheckedValues(name) {
    return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map(
      (el) => el.value
    );
  }

  function buildSummary(data) {
    const {
      jobType,
      issues,
      costLevel,
      notes,
      photoRoom,
      photoPerson,
      contextType
    } = data;

    const parts = [];

    // 1. Résumé de la situation observée
    parts.push("📌 <strong>Résumé de la situation observée</strong>");

    // Type de poste
    if (jobType) {
      let label = "";
      if (jobType === "bureau") label = "poste de bureau / travail sur écran";
      else if (jobType === "manutention") label = "poste de manutention / gestes physiques";
      else if (jobType === "accueil") label = "poste d’accueil / relationnel";
      else if (jobType === "mixte") label = "poste mixte / polyvalent";

      parts.push(`• Type de poste : ${label}.`);
    } else {
      parts.push("• Type de poste : non précisé.");
    }

    // Contexte (recrutement, maintien, retour)
    if (contextType) {
      let ctxLabel = "";
      if (contextType === "recrutement") ctxLabel = "test de recrutement";
      else if (contextType === "maintien") ctxLabel = "situation de maintien dans l’emploi";
      else if (contextType === "retour") ctxLabel = "retour après arrêt de travail / maladie";

      parts.push(`• Contexte : ${ctxLabel}.`);
    }

    // Points de vigilance
    if (issues.length === 0) {
      parts.push("• Aucune difficulté particulière renseignée pour l’instant.");
    } else {
      const labels = {
        fatigue: "fatigue rapide / besoin de pauses",
        gestes: "difficultés sur certains gestes / mouvements",
        deplacements: "difficulté de déplacement (locaux, escaliers…)",
        concentration: "difficultés de concentration / surcharge d’informations",
        communication: "difficultés de communication",
        securite: "risque sécurité identifié"
      };
      const list = issues.map((i) => labels[i] || i).join(", ");
      parts.push(`• Points de vigilance observés : ${list}.`);
    }

    // Description des photos (interprétation humaine)
    if (photoRoom) {
      parts.push(
        `• D’après la photo 1 (pièce / poste) : ${photoRoom.trim()}`
      );
    }

    if (photoPerson) {
      parts.push(
        `• D’après la photo 2 (candidat / salarié en situation) : ${photoPerson.trim()}`
      );
    }

    if (notes) {
      parts.push(`• Notes complémentaires : ${notes.trim()}`);
    }

    // 2. Pistes d’aménagement
    parts.push("<br>🛠️ <strong>Pistes d’aménagement à explorer</strong>");

    if (issues.includes("fatigue") || issues.includes("gestes") || issues.includes("deplacements")) {
      parts.push(
        "• Adapter l’organisation du poste : pauses planifiées, limitation des ports de charge " +
          "ou des déplacements, ajustement du mobilier (siège, hauteur de plan de travail, position de l’écran)."
      );
    }

    if (issues.includes("concentration")) {
      parts.push(
        "• Clarifier et séquencer les tâches : check-lists simples, consignes écrites, " +
          "temps de travail au calme, réduction des interruptions."
      );
    }

    if (issues.includes("communication")) {
      parts.push(
        "• Diversifier les modes de communication : supports écrits, visuels, messagerie, " +
          "réunions courtes avec compte rendu écrit, sous-titres ou transcription si nécessaire."
      );
    }

    if (issues.includes("securite")) {
      parts.push(
        "• Revoir les points de sécurité avec la médecine du travail et, si besoin, le CSE : " +
          "procédures en cas de crise, consignes adaptées, travail à certains postes à éviter."
      );
    }

    if (!issues.length) {
      parts.push(
        "• Aucune difficulté marquée dans les observations : valider avec la personne si elle " +
          "identifie malgré tout des adaptations utiles (outils, rythme, organisation)."
      );
    }

    // 3. Orientation MDPH / Agefiph / Cap Emploi
    parts.push("<br>🧭 <strong>Orientation recommandée</strong>");

    const hasSecurity = issues.includes("securite");
    const hasManyIssues = issues.length >= 3;

    if (costLevel === "faible" && !hasSecurity && !hasManyIssues) {
      parts.push(
        "• Adaptations principalement <strong>internes</strong> : organisation du travail, " +
          "petit matériel, aménagement simple. Une discussion avec la médecine du travail est recommandée, " +
          "mais l’entreprise peut lancer les ajustements dès maintenant."
      );
    } else if (costLevel === "moyen" && !hasSecurity) {
      parts.push(
        "• Combiner adaptations internes et <strong>échanges avec les partenaires</strong> : " +
          "médecine du travail, Cap Emploi, éventuellement Agefiph pour les aides financières " +
          "sur du matériel ou des aménagements plus importants."
      );
    } else if (costLevel === "eleve" || hasSecurity || hasManyIssues) {
      parts.push(
        "• Situation à traiter de façon structurée : mobiliser la <strong>médecine du travail</strong> " +
          "et se rapprocher de la MDPH, de Cap Emploi ou de l’Agefiph pour envisager des aides, " +
          "des aménagements lourds ou un accompagnement renforcé."
      );
    } else {
      parts.push(
        "• Niveau de coût non estimé : commencer par une adaptation interne simple, puis, si besoin, " +
          "se tourner vers la médecine du travail et les partenaires (Cap Emploi, Agefiph, MDPH)."
      );
    }

    // 4. Mini compte rendu “prêt à coller dans un mail”
    parts.push("<br>📝 <strong>Mini compte rendu pour le dossier ou le mail</strong>");

    let contextePhrase = "la situation observée";
    if (contextType === "recrutement") {
      contextePhrase = "la situation observée lors du test de recrutement";
    } else if (contextType === "maintien") {
      contextePhrase = "la situation observée dans le cadre du maintien dans l’emploi";
    } else if (contextType === "retour") {
      contextePhrase = "la situation observée lors du retour après arrêt de travail";
    }

    const crParts = [];

    crParts.push(
      `Dans le cadre de ${contextePhrase}, nous avons observé plusieurs points de vigilance ` +
        `concernant le poste et l’organisation du travail.`
    );

    if (issues.length) {
      crParts.push(
        "Les principales difficultés portent sur : " +
          issues
            .map((i) => {
              if (i === "fatigue") return "la fatigue et le besoin de pauses";
              if (i === "gestes") return "certains gestes ou mouvements";
              if (i === "deplacements") return "les déplacements dans les locaux";
              if (i === "concentration") return "la concentration et la gestion des informations";
              if (i === "communication") return "la communication";
              if (i === "securite") return "un point de sécurité à clarifier";
              return i;
            })
            .join(", ") +
          "."
      );
    } else {
      crParts.push(
        "Aucune difficulté majeure n’a été relevée à ce stade, mais un échange direct avec la personne " +
          "reste nécessaire pour identifier d’éventuels besoins d’adaptation."
      );
    }

    if (costLevel === "faible") {
      crParts.push(
        "Les pistes d’adaptation identifiées semblent compatibles avec des ajustements internes " +
          "(organisation, petit matériel, paramétrages) sans coût important."
      );
    } else if (costLevel === "moyen") {
      crParts.push(
        "Les adaptations envisagées peuvent nécessiter un investissement modéré ; " +
          "un contact avec Cap Emploi ou l’Agefiph pourra être utile pour étudier les aides mobilisables."
      );
    } else if (costLevel === "eleve") {
      crParts.push(
        "Les aménagements à prévoir semblent plus lourds ; une analyse approfondie avec la médecine du travail " +
          "et les dispositifs dédiés (MDPH, Cap Emploi, Agefiph) est recommandée."
      );
    }

    crParts.push(
      "Ce compte rendu ne remplace ni un avis médical, ni une décision RH complète. " +
        "Il sert de base de travail pour construire des adaptations raisonnables en accord avec la personne concernée."
    );

    parts.push(
      "<p>" + crParts.join(" ") + "</p>"
    );

    // 5. Rappel éthique
    parts.push(
      "<br>⚖️ <strong>Rappel important</strong><br>" +
        "Les descriptions issues des photos et des observations ne doivent jamais servir à discriminer ou " +
        "humilier un candidat ou un salarié. Elles doivent uniquement être utilisées pour chercher des " +
        "solutions d’aménagement réalistes et respectueuses."
    );

    return parts.join("<br>");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
      jobType: form.jobType?.value || "",
      issues: getCheckedValues("issues"),
      costLevel: form.costLevel?.value || "",
      notes: form.notes?.value || "",
      photoRoom: form.photoRoom?.value || "",
      photoPerson: form.photoPerson?.value || "",
      contextType: form.contextType?.value || ""
    };

    const html = buildSummary(data);
    resultBox.innerHTML = html;
  });
})();
