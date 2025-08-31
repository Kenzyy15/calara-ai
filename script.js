const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');

function addChatBubble(msg, sender) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = msg;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // Show user message
  addChatBubble(text, "user");
  userInput.value = "";

  // Show typing bubble
  const typingBubble = document.createElement("div");
  typingBubble.className = "chat-bubble ai typing";
  typingBubble.textContent = "Clara is typing...";
  chatBox.appendChild(typingBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("/.netlify/functions/clara", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();

    typingBubble.remove();
    addChatBubble(data.reply, "ai");

  } catch (error) {
    typingBubble.remove();
    addChatBubble("⚠️ Sorry, something went wrong.", "ai");
    console.error(error);
  }
}

// Send message on Enter key
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});
