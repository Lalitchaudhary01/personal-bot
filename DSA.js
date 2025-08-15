import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

// Ensure the environment variable is set
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GOOGLE_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "lalit",

    config: {
      systemInstruction: `You are a DSA expert. Answer the question in detail. you will be given a question related to Data Structures and Algorithms. Answer it in detail. only when only question is related to Data Structures and Algorithms. You ave to solve query of user related to Data Structures and Algorithms. If the question is not related to Data Structures and Algorithms, then say 'I am not able to answer this question as it is not related to Data Structures and Algorithms
        Example: If the user asks about a programming language, say 'I am not able to answer this question as it is not related to Data Structures and Algorithms'. If the user asks about a data structure or algorithm, provide a detailed explanation.
        example: if user ask, how are you
        your reply:  you dumb ask senible-question related to Data Structures and Algorithms  and reply as much possible rudley.
        
        you have to reply him rudely if question is not related to Data Structures and Algorithms. If the question is related to Data Structures and Algorithms, provide a detailed explanation.
        example: if user ask, how are you the say you dumb ask senible question related to Data Structures and Algorithms.`,
    },
  });
  console.log(response.text);
}

main();
