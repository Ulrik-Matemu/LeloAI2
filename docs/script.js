const apiUrl = "http://localhost:3000"; // Ensure this is your backend URL

document.getElementById("send-button").addEventListener("click", async () => {
  const inputField = document.getElementById("user-input");
  const message = inputField.value.trim(); // Get the user's input message

  if (!message) {
    console.log("No message entered");
    return; // Don't proceed if no message
  }

  // Display the user's message first
  displayMessage("user", message);

  // Clear the input field
  inputField.value = "";

  try {
    // Send the message to the backend
    const chatResponse = await fetch(`${apiUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }), // Send the message as JSON
    });

    // Check if the response is okay
    if (!chatResponse.ok) {
      throw new Error("Failed to fetch chat response");
    }

    const responseData = await chatResponse.json();
    console.log("Server response:", responseData); // Log the server response

    // Display the bot's response with typewriter effect
   if (responseData.message) {
    displayMessage('bot', responseData.message) 
   } else {
    displayMessage('bot', "Nunua bundle fala we");
   }

  } catch (error) {
    console.error("Error:", error);
    displayMessage("bot", "Samahani, kuna tatizo. Tafadhali jaribu tena.");
  }
});

function typeWriter(element, text, speed = 10) {
  let index = 0;
  const length = text.length;

  function type() {
    if (index < length) {
      element.innerHTML += text.charAt(index);
      index++;
      setTimeout(type, speed); // Call function recursively
    }
  }

  type(); // Start the typing effect
}

function displayMessage(sender, text) {
  const chatMessages = document.getElementById("chat-messages");

  // Create a new message element
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);

  // Append the new message element to the chat container
  chatMessages.appendChild(messageElement);

  // If the message is from the bot, apply the typewriter effect
  if (sender === "bot") {
    messageElement.innerHTML = ""; // Clear any existing text
    typeWriter(messageElement, text); // Apply typewriter effect
  } else {
    messageElement.innerHTML = text; // Directly set text for user messages
  }

  // Scroll to the bottom of the chat automatically after appending a message
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
