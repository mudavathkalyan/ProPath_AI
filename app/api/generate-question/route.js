import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      console.error("❌ No userId found");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Log: Fetching industry from the database
    console.log(`🔍 Fetching industry for user: ${userId}`);

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    if (!user || !user.industry) {
      console.error("❌ Industry not found in DB");
      return Response.json({ error: "Industry not found" }, { status: 400 });
    }

    const industry = user.industry;
    console.log(`✅ Industry found: ${industry}`);

    // ✅ Log: Generating interview question using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a technical interview question for an expert in ${industry}. Keep it short and relevant.`;
    
    console.log("⏳ Sending request to Gemini API...");
    const result = await model.generateContent(prompt);
    const question = result.response.text(); // ❌ ERROR MIGHT BE HERE!

    console.log(`✅ Question generated: ${question}`);

    return Response.json({ question }, { status: 200 });
  } catch (error) {
    console.error("🔥 Error in generate-question API:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


