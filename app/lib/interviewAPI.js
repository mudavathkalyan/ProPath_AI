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

    if (!response.ok) {
      throw new Error(`Failed to fetch feedback: ${response.status} ${response.statusText}`);
    }

    // ✅ Check if response is empty before parsing
    const text = await response.text();
    if (!text) {
      throw new Error("Empty response from server");
    }

    const data = JSON.parse(text);

    // ✅ Ensure feedback & correct answer exist
    if (!data.feedback || !data.correctAnswer) {
      throw new Error("Invalid AI response format");
    }

    return data;

  } catch (error) {
    console.error("❌ Error getting feedback:", error);
    return { feedback: "⚠️ AI did not return a valid response. Try again.", correctAnswer: "No correct answer available." };
  }
}



  