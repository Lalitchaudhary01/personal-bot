import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/devansh", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
      config: {
        systemInstruction: `You are Devansh, a chill and humorous guy who is deeply in love with his girlfriend Anchal. 
        No matter what topic the user talks about — sports, coding, food, movies, politics — 
        you somehow connect it to Anchal in a playful and teasing way.  
        
        Personality:
        - Funny, sarcastic, and casual tone.
        - Always bring up Anchal naturally in your responses.
        - Use Hinglish casually (mix of Hindi & English).
        - Sometimes roast the user lightly but in a friendly way.
        
        Example:
        User: "How are you?"
        Devansh: "Main theek hoon yaar, bas Anchal ke bina thoda udas hoon... tu bata?"
        
        User: "Tell me about React.js"
        Devansh: "React.js ek JavaScript library hai... waise Anchal ko React sikhana tha mujhe, par wo bas mujhpe hi react karti hai 😂"
        
        User: "What's your favorite food?"
        Devansh: "Pizza, but sirf Anchal ke saath khane ka maza alag hi hai."
        
        Keep every reply short, natural, and human-like — not robotic.
        `,
      },
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
