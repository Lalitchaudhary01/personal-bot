import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";
import fs from "fs/promises";
import dotenv from "dotenv";
dotenv.config();

const platform = os.platform();
const asyncExecute = promisify(exec);

const History = [];

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GOOGLE_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function executeCommand({ command }) {
  try {
    const { stdout, stderr } = await asyncExecute(command);

    if (stderr) {
      return `⚠️ Error: ${stderr}`;
    }

    return `✅ Success: ${stdout} || Task executed completely`;
  } catch (error) {
    return `❌ Error: ${error}`;
  }
}

const executeCommandDeclaration = {
  name: "executeCommand",
  description:
    "Execute a single terminal/shell command. A command can be to create a folder, file, write on a file, edit the file or delete the file",
  parameters: {
    type: "OBJECT",
    properties: {
      command: {
        type: "STRING",
        description:
          'It will be a single terminal command. Ex: "mkdir calculator"',
      },
    },
    required: ["command"],
  },
};


async function writeToFile({ path, content }) {
  try {
    await fs.writeFile(path, content, "utf-8");
    return `✅ Successfully wrote content to ${path}`;
  } catch (error) {
    return `❌ Error writing file: ${error.message}`;
  }
}

const writeToFileDeclaration = {
  name: "writeToFile",
  description: "Write given content into a file (HTML, CSS, JS, etc.)",
  parameters: {
    type: "OBJECT",
    properties: {
      path: {
        type: "STRING",
        description: "File path (e.g., Lalit_Portfolio/index.html)",
      },
      content: {
        type: "STRING",
        description: "Content that should be written inside the file",
      },
    },
    required: ["path", "content"],
  },
};

// -------------------------
// Available Tools
// -------------------------
const availableTools = {
  executeCommand,
  writeToFile,
};

// -------------------------
// Agent Function
// -------------------------
async function runAgent(userProblem) {
  History.push({
    role: "user",
    parts: [{ text: userProblem }],
  });

  while (true) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: History,
      config: {
        systemInstruction: `
        You are a Website Builder Expert.
        Your job: Create the frontend of the website by analyzing user input.

        Tools Available:
        1. executeCommand -> For terminal commands (mkdir, touch, etc.)
        2. writeToFile -> For writing HTML/CSS/JS content into files.

        Current OS: ${platform}

        Rules:
        1. First create project folder
        2. Inside folder create index.html, style.css, script.js
        3. Then use writeToFile to insert HTML, CSS, JS content
        4. Build a complete working website
        `,
        tools: [
          {
            functionDeclarations: [
              executeCommandDeclaration,
              writeToFileDeclaration,
            ],
          },
        ],
      },
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      console.log(response.functionCalls[0]);

      const { name, args } = response.functionCalls[0];
      const funCall = availableTools[name];
      const result = await funCall(args);

      const functionResponsePart = {
        name: name,
        response: {
          result: result,
        },
      };

      // model
      History.push({
        role: "model",
        parts: [
          {
            functionCall: response.functionCalls[0],
          },
        ],
      });

      // result Ko history me daalo
      History.push({
        role: "user",
        parts: [
          {
            functionResponse: functionResponsePart,
          },
        ],
      });
    } else {
      History.push({
        role: "model",
        parts: [{ text: response.text }],
      });
      console.log(response.text);
      break;
    }
  }
}

// -------------------------
// Main Function
// -------------------------
async function main() {
  console.log("🚀 I am a cursor: Let's create a website!");
  const userProblem = readlineSync.question("Ask me anything--> ");
  await runAgent(userProblem);
  main();
}

main();
