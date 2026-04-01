import "dotenv/config";
import readline from "readline/promises";
// readline is a built-in module in Node.js for reading input from the Terminal.
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage } from "langchain";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatMistralAI({
  model: "mistral-small-latest",
});

const messages = []

while (true) {
  const userInput = await rl.question("\x1b[32mYou: \x1b[0m");

  messages.push(new HumanMessage(userInput));

  const response = await model.invoke(messages);

  messages.push(response);

  console.log(`\x1b[34mMistralAI:\x1b[0m ${response.content}`);
}

rl.close();
