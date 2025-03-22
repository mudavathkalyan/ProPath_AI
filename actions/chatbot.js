export async function sendMessage(message) {
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
  
      const data = await res.json();
      return data.response;
    } catch (error) {
      return "Sorry, I couldn't process that request.";
    }
  }
  