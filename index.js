import "dotenv/config";
import readline from "readline/promises";
// readline is a built-in module in Node.js for reading input from the Terminal.
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, tool, createAgent } from "langchain";
import { sendEmail } from "./mail.service.js";
import * as z from "zod";
// Zod used for correct data shape when using tools, it validates the input data against the defined schema and provides type safety.

const emailTool = tool(sendEmail, {
  name: "emailTool",
  description:
    "Send an email when the user explicitly asks. Call this tool only once and then return a final confirmation.",
  schema: z.object({
    to: z.string(),
    subject: z.string(),
    html: z.string(),
  }),
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatMistralAI({
  model: "mistral-small-latest",
});

const agent = createAgent({
  model,
  tools: [emailTool],
});

const messages = [];

while (true) {
  const userInput = await rl.question("\x1b[32mYou: \x1b[0m");

  messages.push(new HumanMessage(userInput));

  const response = await agent.invoke({
    messages,
  });

  messages.push(response.messages[response.messages.length - 1]);
  console.log(response);
  // console.log(response.messages[response.messages.length - 1].text);

  // console.log(`\x1b[34mMistralAI:\x1b[0m ${response.content}`);
}

rl.close();
