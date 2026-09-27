import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
dotenv.config();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",

  temperature: 0.2,
  maxTokens: 4000,
  maxRetries: 2,
});

export default llm;
