/* =========================================
   Mini-WTD · Assistant IA (démo locale)
   - Gère le petit chat Mini-WTD
   - Pas d’appel serveur : tout est simulé côté navigateur
   ========================================= */

(function () {
  const form = document.getElementById('mwtd-chat-form');
  const input = document.getElementById('mwtd-chat-input');
  const messages = document.getElementById('mwtd-chat-messages');

  if (!form || !input || !messages) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const text = (input.value || '').trim();
    if (!text) return;

    // Ajout du message utilisateur
    addBubble(text, 'user');
    input.value = '';

    // Réponse “IA” simulée
    const reply = generateReply(text);
    // petit délai pour faire plus "humain"
    setTimeout(() => {
      addBubble(reply, 'bot');
      scrollToBottom();
    }, 300);
  });

  function addBubble(text, role) {
    const bubble = document.createElement('div');
    bubble.classList.add('mwtd-chat-bubble');
    if (role === 'bot') {
      bubble.classList.add('mwtd-chat-bubble--bot');
      bubble.setAttribute('data-role', 'bot');
    } else {
      bubble.classList.add('mwtd-chat-bubble--user');
      bubble.setAttribute('data-role', 'user');
    }
    bubble.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');
    messages.appendChild(bubble);
  }

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  // Générateur de réponses simplifiées
  function generateReply(text) {
    const lower = text.toLowerCase();

    // Quelques mots-clés simples
    const mentionsFatigue = /fatigue|épuisé|épuisée|fatigué|fatiguée/.test(lower);
    const mentionsDebout = /debout|station debout|piétiner/.test(lower);
    const mentionsCharge = /charge|porter|port de charge|lourd/.test(lower);
    const mentionsPoste = /poste|travail|atelier|bureau|open space/.test(lower);
    const mentionsRh = /rh|ressources humaines|drh/.test(lower);
    const mentionsDouleur = /douleur|douloureux|mal au dos|dos/.test(lower);

    // Réponses scénarisées
    if (mentionsFatigue && mentionsDebout) {
      return (
        "Vous décrivez une fatigue importante en station debout. " +
        "Dans un bilan d’aménagement, vous pouvez formuler ainsi :\n\n" +
        "• La personne peut rester debout pendant une durée limitée, au-delà la fatigue devient invalidante.\n" +
        "• Les déplacements prolongés ou le piétinement aggravent la situation.\n" +
        "• Des pauses courtes et régulières, un siège assis-debout ou une réorganisation du poste peuvent être envisagés.\n\n" +
        "Souhaitez-vous qu’on formule aussi les impacts possibles sur l’organisation du service ?"
      );
    }

    if (mentionsCharge && mentionsDouleur) {
      return (
        "Pour le port de charge avec douleurs, éviter de parler en langage médical. " +
        "On peut écrire par exemple :\n\n" +
        "• Le port répété de charges au-delà d’un certain poids génère des douleurs importantes.\n" +
        "• Certaines tâches nécessitant des charges lourdes ne peuvent plus être effectuées en continu.\n" +
        "• Une aide mécanique, un partage des tâches ou une limitation de poids sont à étudier.\n\n" +
        "Vous pouvez ensuite préciser quelles tâches concrètes sont les plus problématiques."
      );
    }

    if (mentionsPoste && mentionsRh) {
      return (
        "Pour préparer un échange avec les RH, l’idée est de relier la situation de santé à la réalité du poste " +
        "sans entrer dans les détails médicaux.\n\n" +
        "Structure possible :\n" +
        "1) Contexte du poste (type de tâches, rythme, environnement).\n" +
        "2) Difficultés observées dans ces tâches (sans nommer la pathologie).\n" +
        "3) Pistes d’aménagement réalistes déjà identifiées.\n" +
        "4) Points à discuter avec la médecine du travail ou le référent handicap.\n\n" +
        "Si vous voulez, décrivez votre poste et je vous aide à structurer les 4 points."
      );
    }

    if (mentionsFatigue || mentionsDouleur) {
      return (
        "Vous pouvez décrire la fatigue ou la douleur en termes de limites fonctionnelles plutôt qu’en diagnostic. " +
        "Par exemple :\n\n" +
        "• La durée pendant laquelle la tâche peut être réalisée sans douleur importante.\n" +
        "• Les gestes ou postures qui déclenchent la gêne.\n" +
        "• Les moments de la journée où la situation est la plus difficile.\n\n" +
        "Ensuite, on cherchera ensemble quelles tâches adapter en priorité."
      );
    }

    if (/candidat|salarié|salariée/.test(lower)) {
      return (
        "Pour un candidat ou un salarié, Mini-WTD propose de partir des situations de travail plutôt que des étiquettes. " +
        "Vous pouvez décrire :\n\n" +
        "• Ce que la personne fait déjà sans aide.\n" +
        "• Ce qu’elle pourrait faire avec un aménagement raisonnable.\n" +
        "• Ce qui présente un risque ou une impossibilité claire.\n\n" +
        "Donnez-moi un exemple de tâche, et je vous aide à la formuler."
      );
    }

    // Réponse générique par défaut
    return (
      "Merci pour ces éléments. Pour aller plus loin, vous pouvez :\n\n" +
      "1) Décrire le poste (tâches principales, rythme, environnement).\n" +
      "2) Préciser les difficultés observées sur certaines tâches, sans citer de diagnostic.\n" +
      "3) Imaginer quelques pistes d’aménagement réalistes (organisation, matériel, horaires…).\n\n" +
      "Si vous le souhaitez, reformulez votre message en détaillant le poste et une tâche précise. " +
      "Je vous proposerai une version prête à copier dans un bilan d’aménagement."
    );
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
