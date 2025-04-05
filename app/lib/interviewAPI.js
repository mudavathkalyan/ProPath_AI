// /lib/interviewAPI.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function getFeedback(userAnswer, questionObj) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an expert technical interviewer.

Below is the interview question:
"${questionObj.question}"

The candidate answered:
"${userAnswer}"

Please evaluate the response and return a JSON object with the following fields:
- "feedback": Provide clear, constructive feedback on the answer (strengths, weaknesses, correctness, relevance, etc.).
- "correctAnswer": Share the ideal, detailed correct answer.
- "suggestedAnswer": Provide a simpler or beginner-friendly version of the correct answer.

⚠️ Important: Format your entire reply as a **pure JSON object** like this:
{
  "feedback": "...",
  "correctAnswer": "...",
  "suggestedAnswer": "..."
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return parsed;
  } catch (error) {
    console.error("❌ Error parsing feedback from Gemini:", error);
    return {
      feedback: "Sorry, something went wrong while generating feedback.",
      correctAnswer: "Not available.",
      suggestedAnswer: "Not available.",
    };
  }
}
