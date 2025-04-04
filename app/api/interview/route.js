export async function POST(req) {
  try {
    console.log("✅ Received request at /api/interview");

    const body = await req.json().catch((err) => {
      console.error("❌ Error parsing request body:", err);
      return null;
    });

    console.log("📥 Request body:", body);

    if (!body || !body.userAnswer || !body.question) {
      console.error("❌ Missing userAnswer or question in request body");
      return new Response(JSON.stringify({ error: "Missing data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { userAnswer, question } = body;

    // 🔥 Call AI API (Replace with real AI logic later)
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_OPENAI_API_KEY`, // Replace with actual key
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert interviewer giving constructive feedback." },
          { role: "user", content: `Question: ${question}\nUser Answer: ${userAnswer}\n\nGive feedback and provide the correct answer.` },
        ],
      }),
    });

    const aiData = await aiResponse.json();
    console.log("📤 AI Response:", aiData);

    // Extract AI-generated feedback & correct answer
    const feedback = aiData.choices?.[0]?.message?.content || "⚠️ AI did not return a valid response.";
    
    // Ensure correctAnswer is extracted properly
    const correctAnswer = feedback.includes("Correct Answer:") ? feedback.split("Correct Answer:")[1].trim() : "No correct answer provided.";

    return new Response(
      JSON.stringify({ feedback, correctAnswer }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ API Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
