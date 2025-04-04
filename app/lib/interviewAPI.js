export async function getQuestions(industry) {
  try {
    const response = await fetch(`/api/interview/questions?industry=${industry}`);
    if (!response.ok) throw new Error("Failed to fetch questions");
    return await response.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

  
export async function getFeedback(userAnswer, question) {
  try {
    const response = await fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userAnswer, question }),
    });

    console.log("🛰 Response status:", response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error("⚠️ API error response:", text);
      throw new Error("Failed to fetch feedback");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("🚨 getFeedback() error:", error);
    return {
      feedback: "⚠️ AI did not return a valid response. Try again.",
    };
  }
}



  