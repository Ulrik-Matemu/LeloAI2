// Configuration
const API_KEY = 'AIzaSyD5FSHCfoLp-fcYADVhjthGHYbBenSJX80'; // Replace with your actual API key
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

document.getElementById("send-button").addEventListener("click", async () => {
  const inputField = document.getElementById("user-input");
  const message = inputField.value.trim();

  if (!message) {
    console.log("No message entered");
    return;
  }

  displayMessage("user", message);
  inputField.value = "";

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const chatResponse = data.candidates[0].content.parts[0].text;
    displayMessage('bot', chatResponse);
  } catch (error) {
    console.error("Error:", error);
    displayMessage("bot", "Sorry, there was an error. Please try again.");
  }
});

function typeWriter(element, text, speed = 10) {
  let index = 0;
  const length = text.length;

  function type() {
    if (index < length) {
      element.innerHTML += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }

  type();
}

function displayMessage(sender, text) {
  const chatMessages = document.getElementById("chat-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  chatMessages.appendChild(messageElement);

  if (sender === "bot") {
    messageElement.innerHTML = "";
    typeWriter(messageElement, text);
  } else {
    messageElement.innerHTML = text;
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;
}
