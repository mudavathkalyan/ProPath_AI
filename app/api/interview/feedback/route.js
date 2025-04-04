// app/api/interview/feedback/route.js

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
  
    try {
      const { question, userAnswer } = req.body;
  
      const aiResponse = await fetch("YOUR_AI_API_ENDPOINT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, question, userAnswer }),
      });
  
      const textResponse = await aiResponse.text();
      console.log("🔍 Raw AI Response:", textResponse);
  
      let parsedData;
      try {
        parsedData = JSON.parse(textResponse);
      } catch (e) {
        console.error("🚨 JSON Parse Error:", e);
        parsedData = { feedback: "AI response could not be parsed.", correctAnswer: "N/A" };
      }
  
      return res.status(200).json(parsedData);
    } catch (error) {
      console.error("🚨 API Error:", error);
      return res.status(500).json({ feedback: "Internal server error.", correctAnswer: "N/A" });
    }
  }
  