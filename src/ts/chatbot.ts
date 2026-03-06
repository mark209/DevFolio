type MessageType = "bot" | "user";

interface ChatResponse {
  reply: string;
}

const chatbotToggle = document.getElementById("chatbotToggle");
const chatbotPanel = document.getElementById("chatbotPanel");
const chatbotClose = document.getElementById("chatbotClose");
const chatbotForm = document.getElementById("chatbotForm") as HTMLFormElement | null;
const chatbotField = document.getElementById("chatbotField") as HTMLInputElement | null;
const chatbotMessages = document.getElementById("chatbotMessages");

const toggleChat = (open?: boolean): void => {
  if (!chatbotPanel) return;
  const isOpen = open ?? !chatbotPanel.classList.contains("active");
  chatbotPanel.classList.toggle("active", isOpen);
  chatbotPanel.setAttribute("aria-hidden", (!isOpen).toString());
  if (isOpen && chatbotField) {
    chatbotField.focus();
  }
};

const appendMessage = (content: string, type: MessageType = "bot"): void => {
  if (!chatbotMessages) return;
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = content;
  chatbotMessages.appendChild(message);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
};

const sendMessage = async (text: string): Promise<void> => {
  appendMessage(text, "user");
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = (await response.json()) as ChatResponse;
    appendMessage(data.reply, "bot");
  } catch {
    appendMessage("Sorry, I am offline right now.", "bot");
  }
};

chatbotToggle?.addEventListener("click", () => toggleChat(true));
chatbotClose?.addEventListener("click", () => toggleChat(false));

chatbotForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!chatbotField) return;
  const text = chatbotField.value.trim();
  if (!text) return;
  chatbotField.value = "";
  void sendMessage(text);
});
