// import { generateInterviewQuestions } from "@/app/lib/ai"; // AI API

import { generateInterviewQuestions } from "@/app/lib/ai";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const industry = searchParams.get("industry");

    if (!industry) {
      return new Response(JSON.stringify({ error: "Industry is required" }), { status: 400 });
    }

    const questions = await generateInterviewQuestions(industry, 10); // 👈 This must be defined

    return new Response(JSON.stringify(questions), { status: 200 });
  } catch (error) {
    console.error("❌ GET /questions Error:", error); // Add this to log it!
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

