"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message) throw new Error("Message is required");

    // Constructing a prompt
    // const prompt = `
    //   You are a helpful AI assistant. Answer the user's question concisely.
    //   User's message: "${message}"
    // `;
    const prompt = `
You are a highly knowledgeable and helpful AI assistant. 
Your goal is to provide **clear, concise, and accurate** answers.
- **Keep responses short and to the point** (unless the user asks for detailed explanations).
- **Use markdown formatting** for better readability (e.g., bold for key points, bullet points for lists).
- **Provide code snippets** if relevant, wrapped in proper formatting.
- **If you don’t know the answer, say so** instead of making something up.

User's message: "${message}"
`;


    // Use `generateContent` correctly
    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });

    const response = result.response.text().trim();
    return new Response(JSON.stringify({ response }), { status: 200 });
  } catch (error) {
    console.error("Chatbot Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500 });
  }
}
