import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // ✅ Make sure this env var exists

export async function generateInterviewQuestions(industry, count = 10) {
  const prompt = `Generate ${count} unique and technical interview questions for ${industry} domain. Return only the questions in a numbered list.`;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Parse numbered list from AI response
  const questions = text
    .split("\n")
    .filter((line) => /^\d+\./.test(line))
    .map((line) => line.replace(/^\d+\.\s*/, "").trim());

  return questions;
}
