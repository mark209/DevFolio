const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotField = document.getElementById('chatbotField');
const chatbotMessages = document.getElementById('chatbotMessages');

// Toggle chat panel visibility while keeping focus behavior accessible.
const toggleChat = (open) => {
  if (!chatbotPanel) return;
  const isOpen = open ?? !chatbotPanel.classList.contains('active');
  chatbotPanel.classList.toggle('active', isOpen);
  chatbotPanel.setAttribute('aria-hidden', (!isOpen).toString());
  if (isOpen && chatbotField) {
    chatbotField.focus();
  }
};

const appendMessage = (content, type = 'bot') => {
  if (!chatbotMessages) return;
  const message = document.createElement('div');
  message.className = `message ${type}`;
  message.textContent = content;
  chatbotMessages.appendChild(message);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
};

const sendMessage = async (text) => {
  appendMessage(text, 'user');
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    const data = await response.json();
    appendMessage(data.reply, 'bot');
  } catch (error) {
    appendMessage('Sorry, I am offline right now.', 'bot');
  }
};

chatbotToggle?.addEventListener('click', () => toggleChat(true));
chatbotClose?.addEventListener('click', () => toggleChat(false));

chatbotForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = chatbotField.value.trim();
  if (!text) return;
  chatbotField.value = '';
  sendMessage(text);
});
