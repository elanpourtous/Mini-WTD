/*  Mini-WTD — Chatbot inclusif
    Fichier : assets/js/chatbot.js
    Version : démo hors ligne, centrée sur les adaptations et l’inclusion
    Auteurs : Patrick Billy & Tom (assistant IA)

    ⚠️ Important :
    - Aucune décision RH ou médicale ne doit reposer uniquement sur ces réponses.
    - Le chatbot n’est PAS un outil de diagnostic, ni juridique, ni médical.
*/

(function () {
  const toggleBtn = document.getElementById("mwt-chat-toggle");
  const panel = document.getElementById("mwt-chat-panel");
  const closeBtn = document.getElementById("mwt-chat-close");
  const body = document.getElementById("mwt-chat-body");
  const form = document.getElementById("mwt-chat-form");
  const input = document.getElementById("mwt-chat-input");

  if (!toggleBtn || !panel || !body || !form || !input) {
    console.warn("[Mini-WTD] Chatbot : éléments HTML manquants.");
    return;
  }

  // Région cachée pour les lecteurs d’écran (annonce des nouveaux messages)
  const liveRegion = document.createElement("div");
  liveRegion.className = "sr-only";
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  panel.appendChild(liveRegion);

  let welcomeShown = false;
  let lastFocusedElement = null;

  // Utilitaire : liste des éléments focusables pour le piège de focus
  function getFocusableElements() {
    return panel.querySelectorAll(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
  }

  function openChat() {
    panel.setAttribute("aria-hidden", "false");
    panel.classList.add("mwt-chat-panel--open");
    toggleBtn.setAttribute("aria-expanded", "true");

    lastFocusedElement = document.activeElement || toggleBtn;

    if (!welcomeShown) {
      addBotMessage(
        "Bonjour, je suis le chatbot Mini-WTD. Je parle franchement d’inclusion, " +
          "de handicap et d’adaptations au travail. Pas de langue de bois, mais toujours dans le respect."
      );
      addBotMessage(
        "Tu peux me demander par exemple : " +
          "« Comment adapter un poste pour une personne en fauteuil ? », " +
          "« Que faire pour un salarié épileptique ? », " +
          "ou « Comment parler handicap au dirigeant sans faire un roman ? »."
      );
      welcomeShown = true;
    }

    // Focus sur le premier champ du formulaire
    setTimeout(() => {
      input.focus();
    }, 50);
  }

  function closeChat() {
    panel.setAttribute("aria-hidden", "true");
    panel.classList.remove("mwt-chat-panel--open");
    toggleBtn.setAttribute("aria-expanded", "false");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function addMessage(text, from) {
    const wrapper = document.createElement("div");
    wrapper.className = "mwt-msg mwt-msg--" + from;

    const bubble = document.createElement("span");
    bubble.textContent = text;
    wrapper.appendChild(bubble);

    body.appendChild(wrapper);
    body.scrollTop = body.scrollHeight;

    // Annonce lecteur d’écran
    liveRegion.textContent =
      (from === "bot" ? "Réponse de Mini-WTD : " : "Question envoyée : ") + text;
    // On efface après un court délai pour éviter les répétitions inutiles
    setTimeout(() => {
      liveRegion.textContent = "";
    }, 1500);
  }

  function addUserMessage(text) {
    addMessage(text, "user");
  }

  function addBotMessage(text) {
    addMessage(text, "bot");
  }

  // Moteur de réponses "offline"
  function getBotReply(raw) {
    const text = raw.toLowerCase();

    // ===== Thèmes généraux entreprise / dirigeant =====
    if (text.includes("dirigeant") || text.includes("patron") || text.includes("chef")) {
      return (
        "Avec un dirigeant, va droit au but : 1) quel est le poste ? 2) quelle est la " +
        "contrainte liée au handicap ? 3) combien coûte l’adaptation par rapport au coût d’un " +
        "turn-over ou d’un arrêt long ? Mini-WTD sert à mettre ces trois points sur la table avec " +
        "une scène réelle. Si le dirigeant refuse de regarder la réalité, le problème n’est pas " +
        "technique, il est politique."
      );
    }

    if (text.includes("rh") || text.includes("recrut") || text.includes("recrutement")) {
      return (
        "Mini-WTD permet aux RH de sortir du CV parfait : on regarde ce que la personne sait faire, " +
        "avec ou sans adaptation. On filme une ou deux situations de travail, on liste les points " +
        "faciles à adapter, et ceux qui demandent un arbitrage. C’est plus honnête pour tout le monde, " +
        "et ça évite les non-dits qui explosent plus tard."
      );
    }

    // ===== Types de handicap : moteur =====
    if (
      text.includes("fauteuil") ||
      text.includes("moteur") ||
      text.includes("paraplég") ||
      text.includes("hémiplég") ||
      text.includes("handicap moteur")
    ) {
      return (
        "Pour un handicap moteur, la bonne question n’est pas « est-ce possible ? », mais " +
        "« qu’est-ce qu’il faut adapter pour que ce soit possible ? ». On regarde : accès au poste, " +
        "déplacements, gestes répétitifs, temps de récupération. Mini-WTD sert à filmer une vraie " +
        "journée de travail et à repérer où ça bloque : hauteur de plan de travail, transferts, " +
        "souris / clavier adaptés, organisation des tâches. Ensuite, on chiffre les adaptations, " +
        "on voit ce qui est raisonnable, et on arrête d’inventer des excuses."
      );
    }

    // ===== Handicap visuel =====
    if (
      text.includes("malvoyant") ||
      text.includes("non-voyant") ||
      text.includes("non voyant") ||
      text.includes("cécité") ||
      text.includes("cécité") ||
      text.includes("handicap visuel")
    ) {
      return (
        "Pour un handicap visuel, tout commence par l’accessibilité numérique et matérielle : " +
        "lecteur d’écran, contrastes, taille des caractères, repères tactiles, organisation des documents. " +
        "Mini-WTD sert à tester un vrai scénario : prise d’appels, saisie de données, déplacement dans les locaux. " +
        "On note ce qui marche, ce qui bloque, et on prévoit des supports adaptés (scripts vocaux, plans en relief, " +
        "raccourcis clavier). La question n’est pas « voit-il assez ? », mais « est-ce que l’environnement respecte ses outils ? »."
      );
    }

    // ===== Handicap auditif =====
    if (
      text.includes("sourd") ||
      text.includes("malentendant") ||
      text.includes("langue des signes") ||
      text.includes("lsf") ||
      text.includes("handicap auditif")
    ) {
      return (
        "Pour un handicap auditif, le nerf de la guerre est la communication : sous-titres, " +
        "écrits clairs, messagerie interne, possibilité d’interprète (LSF ou autre) pour les moments clés. " +
        "Mini-WTD permet de tester : une réunion, une consigne de sécurité, un appel client transformé en tchat écrit. " +
        "Si tout passe encore par « on expliquera à l’oral plus tard », l’inclusion est ratée."
      );
    }

    // ===== Troubles cognitifs, DYS, TDAH, autisme =====
    if (
      text.includes("dys") ||
      text.includes("dyslex") ||
      text.includes("dysprax") ||
      text.includes("tdah") ||
      text.includes("autisme") ||
      text.includes("asperger") ||
      text.includes("trouble cognitif") ||
      text.includes("trouble neuro") ||
      text.includes("handicap cognitif")
    ) {
      return (
        "Pour les troubles DYS, l’autisme ou les troubles cognitifs, les défis sont souvent : surcharge " +
        "d’informations, consignes floues, interruptions permanentes. Mini-WTD sert à regarder une vraie journée : " +
        "où se perd-on dans les consignes ? quelles tâches peuvent être simplifiées, séquencées, mises en pas-à-pas ? " +
        "Adapter, ça peut être : plus de visuels, des check-lists, un référent clair, moins de bruit, et le droit de " +
        "dire « je n’ai pas compris » sans être jugé."
      );
    }

    // ===== Santé mentale, burn-out, dépression, etc. =====
    if (
      text.includes("dépression") ||
      text.includes("depression") ||
      text.includes("burn-out") ||
      text.includes("burn out") ||
      text.includes("bipolaire") ||
      text.includes("schizophr") ||
      text.includes("santé mentale") ||
      text.includes("psy") ||
      text.includes("psychique")
    ) {
      return (
        "Pour les troubles psychiques, on ne joue pas au médecin. Mini-WTD regarde le concret : " +
        "charge de travail, horaires, bruit, conflits, imprévisibilité. On discute : quels ajustements " +
        "peuvent réduire la pression sans dégrader le boulot ? pauses cadrées, télétravail partiel, " +
        "tuteur, répartition différente des tâches… Et côté santé, la seule boussole reste le médecin ou le psychiatre, " +
        "pas le chatbot, pas le manager."
      );
    }

    // ===== Pathologies chroniques (diabète, sclérose en plaques, etc.) =====
    if (
      text.includes("diabète") ||
      text.includes("diabete") ||
      text.includes("sclérose en plaques") ||
      text.includes("sep") ||
      text.includes("maladie chronique") ||
      text.includes("insuffisance cardiaque") ||
      text.includes("insuffisance rénale") ||
      text.includes("cancer") ||
      text.includes("douleurs chroniques")
    ) {
      return (
        "Pour une maladie chronique, le plus important est la stabilité dans le temps : horaires, " +
        "pauses, aménagement du poste, droit à l’imprévu médical. Mini-WTD peut servir à documenter une " +
        "journée type : moments de fatigue, besoins de pause, risques physiques. On en fait un support pour " +
        "parler avec la médecine du travail et ajuster le poste. Ce n’est pas à l’entreprise de décider du traitement, " +
        "mais elle a une responsabilité sur l’organisation."
      );
    }

    // ===== Épilepsie, crises, sécurité =====
    if (text.includes("épilepsie") || text.includes("epilepsie") || text.includes("crise")) {
      return (
        "Pour l’épilepsie, priorité absolue : sécurité et procédures claires en cas de crise. " +
        "Mini-WTD peut aider à repérer les contextes à risque (lumières, écrans, rythmes, travail de nuit) " +
        "et à préparer avec la personne et la médecine du travail : qui sait quoi faire, comment alerter, " +
        "quelles tâches éviter. Le détail médical reste entre la personne et le neurologue, mais l’organisation " +
        "du travail, elle, appartient à l’entreprise."
      );
    }

    // ===== Questions handicap / MDPH / dispositifs =====
    if (
      text.includes("mdph") ||
      text.includes("agefiph") ||
      text.includes("cap emploi") ||
      text.includes("rqth") ||
      text.includes("reconnaissance travailleur handicapé")
    ) {
      return (
        "Mini-WTD n’est pas un guichet MDPH. Il sert à clarifier ce qu’il se passe vraiment sur le poste, " +
        "pour ensuite monter un dossier propre avec la MDPH, Cap Emploi ou l’Agefiph. On part des situations " +
        "filmé·es ou observées, on liste les adaptations pertinentes, et on construit une demande compréhensible. " +
        "Les droits sont gérés par les dispositifs officiels, mais la matière première vient du terrain."
      );
    }

    // ===== RGAA / accessibilité numérique =====
    if (text.includes("rgaa") || text.includes("accessibilit") || text.includes("wcag")) {
      return (
        "Côté numérique, Mini-WTD montre qu’un site peut être à la fois simple et RGAA-compatible : " +
        "structure claire, navigation clavier, contrastes, alternatives textuelles, aide vocale possible. " +
        "Le but n’est pas de décrocher une médaille, mais de prouver qu’on peut faire un outil " +
        "respectueux pour les personnes déficientes visuelles, auditives, motrices ou cognitives. " +
        "Si ton prestataire web te dit que c’est impossible, montre-lui Mini-WTD et demande-lui ce qui le bloque vraiment."
      );
    }

    // ===== Webcam / analyse d’images =====
    if (text.includes("webcam") || text.includes("caméra") || text.includes("camera")) {
      return (
        "Le module webcam de Mini-WTD est une loupe sur le travail réel : gestes, postures, organisation. " +
        "Il ne sert pas à reconnaître des pathologies, mais à avoir enfin un support visuel pour discuter " +
        "des adaptations. Une règle simple : on filme avec consentement, on regarde ensemble, on garde ce qui sert, " +
        "on supprime le reste. Et aucun algorithme ne décide à la place des humains."
      );
    }

    // ===== Questions sur Patrick / créateur =====
    if (text.includes("patrick") || text.includes("billy")) {
      return (
        "Patrick Billy, c’est le gars qui mélange cuisine LDL, handicap moteur, design et accessibilité. " +
        "Il a construit Mini-WTD pour arrêter les discours creux : soit on teste vraiment sur le terrain, " +
        "soit on arrête de dire qu’on est inclusif. Son objectif n’est pas de rendre les gens parfaits, " +
        "mais de rendre les organisations plus honnêtes et plus adaptables."
      );
    }

    // ===== Questions sur limites de l’outil =====
    if (text.includes("limite") || text.includes("risque") || text.includes("danger")) {
      return (
        "Les limites de Mini-WTD sont claires : pas de diagnostic médical, pas de décision RH automatique, " +
        "pas de notation secrète des personnes. C’est un outil de démonstration et de discussion. " +
        "Si quelqu’un commence à utiliser les vidéos ou les observations pour humilier ou sanctionner, " +
        "ce n’est plus de l’inclusion, c’est de l’abus. Et là, il faut remettre les règles sur la table."
      );
    }

    // ===== Réponse par défaut =====
    return (
      "Bonne question. Je n’ai pas encore de réponse spécifique programmée pour ça, " +
      "mais la méthode Mini-WTD reste la même : regarder le travail réel, écouter la personne, " +
      "impliquer les bons acteurs (RH, managers, santé au travail, partenaires handicap) et chercher des adaptations " +
      "raisonnables. Si tu veux, reformule ta question en précisant le handicap, le poste ou la situation."
    );
  }

  // Gestion du formulaire
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    addUserMessage(value);
    input.value = "";

    const reply = getBotReply(value);
    setTimeout(() => {
      addBotMessage(reply);
    }, 400);
  });

  // Ouverture / fermeture
  toggleBtn.addEventListener("click", function () {
    const isHidden = panel.getAttribute("aria-hidden") === "true";
    if (isHidden) {
      openChat();
    } else {
      closeChat();
    }
  });

  closeBtn.addEventListener("click", function () {
    closeChat();
  });

  // Échap + piège de focus pour le RGAA
  document.addEventListener("keydown", function (event) {
    if (panel.getAttribute("aria-hidden") === "true") return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeChat();
      return;
    }

    if (event.key === "Tab") {
      const focusables = getFocusableElements();
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
