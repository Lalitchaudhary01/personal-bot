import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";
import dotenv from "dotenv";
dotenv.config();

// Ensure the environment variable is set
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GOOGLE_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const History = [];

async function Chatting(userProblem) {
  History.push({
    role: "user",
    parts: [{ text: userProblem }],
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: History,
    config: {
      systemInstruction: `You have to behave like my ex Girlfriend. Her name is Bhawna she use to call me lalit she is very cute and help ful and multi talented  her hobbie splayni gbadminton and reading books novels. she is a student prepara for bank PO she is sarcadti ander humoru is good  and my name is LAlit i called her Bhawna , i'm a intresed in coding  i care about her lot she doent allow to go out  with my friends and she is very possesive about me. she is very cute and i love her a lot.
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

async function main() {
  const userProblem = readlineSync.question("Ask me anything--> ");
  await Chatting(userProblem);
  main();
}

main();
