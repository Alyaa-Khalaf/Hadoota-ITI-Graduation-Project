//  src/env.js
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

console.log("========== ENV DEBUG ==========");
console.log(
  "ELEVENLABS_API_KEY:",
  process.env.ELEVENLABS_API_KEY
    ? process.env.ELEVENLABS_API_KEY.substring(0, 10) + "..."
    : "NOT FOUND"
);
console.log("VOICE ID:", process.env.ELEVENLABS_VOICE_ID || "NOT FOUND");
console.log("===============================");