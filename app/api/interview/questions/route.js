export async function GET(req) {
    try {
      // Extract industry from query params
      const { searchParams } = new URL(req.url);
      const industry = searchParams.get("industry");
  
      if (!industry) {
        return new Response(JSON.stringify({ error: "Industry is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      // Sample questions per industry
      const questionsDB = {
        React: [
          "What are React hooks?",
          "Explain the virtual DOM in React.",
          "What is the difference between props and state in React?",
        ],
        Java: [
          "What is polymorphism in Java?",
          "Explain the difference between abstract class and interface.",
          "What are Java collections?",
        ],
        SQL: [
          "What is the difference between SQL and NoSQL?",
          "Explain primary keys and foreign keys.",
          "What is an index in SQL, and why is it used?",
        ],
        "Next.js": [
          "How does Next.js handle server-side rendering?",
          "What is ISR (Incremental Static Regeneration) in Next.js?",
          "How do you optimize images in Next.js?",
        ],
        Python: [
          "Explain the difference between lists and tuples.",
          "What are Python decorators?",
          "How does Python manage memory?",
        ],
      };
  
      // Get questions based on industry
      const questions = questionsDB[industry] || ["No questions available for this industry."];
  
      return new Response(JSON.stringify(questions), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  