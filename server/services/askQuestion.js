import { promises as fs } from "fs";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function askQuestion(req, res) {
  try {
    // Read all text files from documents
    const files = await fs.readdir("uploads/documents");
    const textFiles = files.filter(f => f.endsWith(".txt"));
    
    // Read all document contents
    const contents = await Promise.all(
      textFiles.map(async f => 
        fs.readFile(`uploads/documents/${f}`, "utf-8")
      )
    );

    // Combine content with limit
    const context = contents.join("\n").substring(0, 3000);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Context: ${context}\n\nQuestion: ${req.body.question}`
      }]
    });

    res.json({ answer: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}