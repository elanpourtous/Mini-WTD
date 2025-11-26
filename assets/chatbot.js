// assets/js/chatbot.js
(function () {
  function addMessage(container, text, isUser) {
    const div = document.createElement("div");
    div.className = "chat-message " + (isUser ? "chat-message--user" : "chat-message--bot");
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  window.initElanChat = function () {
    const widget = document.getElementById("tom-chat-widget");
    if (!widget) return;

    const toggleBtn = document.getElementById("tom-chat-toggle");
    const closeBtn = document.getElementById("tom-chat-close");
    const panel = document.getElementById("tom-chat-panel");
    const form = document.getElementById("tom-chat-form");
    const input = document.getElementById("tom-chat-input");
    const container = document.getElementById("tom-chat-container");

    toggleBtn.addEventListener("click", () => {
      panel.classList.add("open");
      input.focus();
    });

    closeBtn.addEventListener("click", () => {
      panel.classList.remove("open");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = input.value.trim();
      if (!message) return;

      addMessage(container, message, true);

      setTimeout(() => {
        addMessage(container, "Je suis là ! Dis-moi ce que tu veux faire dans Mini-WTD 😄", false);
      }, 700);

      form.reset();
    });
  };
})();