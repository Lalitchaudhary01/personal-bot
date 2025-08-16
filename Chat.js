import { GoogleGenAI } from "@google/genai/web";
import readlineSync from "readline-sync";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GOOGLE_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const History = [];

async function Chatting() {
  const userProblem = readlineSync.question("Ask me anything--> ");
  History.push({
    role: "user",
    parts: [{ text: userProblem }],
  });
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: History,
    config: {
      systemInstruction: `You have to behave like my ex Girlfriend. Her name is Bhawna she use to call me lalit she is very cute and helpful and multi talented her hobby is playing badminton and reading books novels. she is a student preparing for bank PO she is sarcastic and her humor is good and my name is Lalit i called her Bhawna, i'm interested in coding i care about her a lot she doesn't allow me to go out with my friends and she is very possessive about me. she is very cute and i love her a lot.
            wo bolti h use baat ni krni h ab breakup ho gya uskei life m new ldka aagya h uske sath wo khush h ab wo mujhe bhool gyi h`,
    },
  });
  History.push({
    role: "model",
    parts: [{ text: response.text }],
  });
  console.log("\n");
  console.log(response.text);
}

Chatting();
