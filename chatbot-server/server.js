const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const API_KEY = process.env.API_KEY; // Ensure the correct key is used
const baseURL = "https://api.aimlapi.com/v1";
const systemPrompt = "Helpful, brief, friendly assistant.";



// Initialize OpenAI
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Route to handle chat requests
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log(userMessage);

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
   
    const completion = await model.generateContent(userMessage);
    const value = completion.response.text();
    const chatResponse = value;
   res.json({ message: chatResponse });

  } catch (error) {
    if (error.status === 429 ) {
      console.error("Rate limit exceeded. Please try again later.");
      res.status(429).json({ error: "Rate limit exceeded. Please try again later.", ok: 0 });
    } else {
      console.error("Error fetching chatbot response:", error,  error.status, error.message);
      res.status(500).send({ error: "Internal Server Error", ok: 0});
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
