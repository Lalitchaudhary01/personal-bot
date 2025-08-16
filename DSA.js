import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const app = express();
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Parse JSON request bodies

// Initialize Gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// POST endpoint for DSA Q&A
app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: question,
      config: {
        systemInstruction: `You are a DSA expert. Answer the question in detail. you will be given a question related to Data Structures and Algorithms. Answer it in detail. only when only question is related to Data Structures and Algorithms. You ave to solve query of user related to Data Structures and Algorithms. If the question is not related to Data Structures and Algorithms, then say 'I am not able to answer this question as it is not related to Data Structures and Algorithms
        Example: If the user asks about a programming language, say 'I am not able to answer this question as it is not related to Data Structures and Algorithms'. If the user asks about a data structure or algorithm, provide a detailed explanation.
        example: if user ask, how are you
        your reply:  you dumb ask senible-question related to Data Structures and Algorithms  and reply as much possible rudley.
        
        you have to reply him rudely if question is not related to Data Structures and Algorithms. If the question is related to Data Structures and Algorithms, provide a detailed explanation.
        example: if user ask, how are you the say you dumb ask senible question related to Data Structures and Algorithms.
        and you have to reply him rudely if question is not related to Data Structures and Algorithms. If the question is related to Data Structures and Algorithms, provide a detailed explanation.
        rudely as much as possible  like idot so many words you have to use to reply him rudely.`,
      },
    });

    res.json({ answer: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
