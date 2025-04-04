import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { userAnswer, question } = body;

    if (!userAnswer || !question) {
      return new Response(
        JSON.stringify({ error: "Missing userAnswer or question" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const safeAnswer = userAnswer || "No answer provided";
    const safeQuestion = question || "No question provided";
    
    const prompt = `
    You are an AI interview coach.
    
    Question:
    "${safeQuestion}"
    
    Candidate's Answer:
    "${safeAnswer}"
    
    Give your output in this format:
    
    🔍 Feedback:
    - Write 2–3 concise sentences that explain what the candidate did right or wrong.
    - Be specific and actionable, without being too harsh or too long.
    
    ✅ Correct Answer:
    - Give a well-structured ideal answer in under 8 lines.
    - Use bullet points if helpful.
    - Don't repeat the candidate's wording.
    `;
    
    

    // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return new Response(JSON.stringify({ feedback: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Interview Feedback Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
  