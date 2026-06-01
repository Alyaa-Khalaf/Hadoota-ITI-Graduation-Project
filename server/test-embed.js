import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

const result = await model.embedContent("test");

console.log("✅ Works! Dimensions:", result.embedding.values.length);