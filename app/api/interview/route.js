export async function POST(req) {
    try {
      console.log("✅ Received request at /api/interview");
  
      const body = await req.json().catch((err) => {
        console.error("❌ Error parsing request body:", err);
        return null;
      });
  
      console.log("📥 Request body:", body);
  
      if (!body || !body.userAnswer) {
        console.error("❌ Missing userAnswer in request body");
        return new Response(JSON.stringify({ error: "Missing userAnswer" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      // Simulating AI Feedback
      const response = {
        feedback: "Your answer is structured well but needs more clarity.",
        improvement: "Use more technical terms and real-world examples.",
      };
  
      console.log("📤 Sending response:", response);
  
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  
    } catch (error) {
      console.error("❌ API Error:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  