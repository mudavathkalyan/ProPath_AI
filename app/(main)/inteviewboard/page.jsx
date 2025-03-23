// interview board
"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Send, CheckCircle, Lightbulb, ArrowRight } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function InterviewBoard() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [improvement, setImprovement] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);
  const [industry, setIndustry] = useState("");
  const { getToken } = useAuth();

  // Fetch industry on mount
  useEffect(() => {
    const fetchIndustry = async () => {
      try {
        const token = await getToken();
        const res = await fetch("/api/user/industry", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch industry");
        const data = await res.json();
        setIndustry(data.industry);
        fetchQuestion(data.industry);
      } catch (error) {
        console.error("Fetch Industry Error:", error);
      }
    };
    fetchIndustry();
  }, [getToken]);


    


  // Fetch AI-generated question based on industry
  
const fetchQuestion = async () => {
  try {
    const token = await getToken();
    const res = await fetch("/api/generate-question", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    setQuestion(data.question);
  } catch (error) {
    console.error("Error fetching question:", error);
  }
};

// ✅ Fetch question when page loads
useEffect(() => {
  fetchQuestion();
}, []);

  // Speech-to-text function
  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      setAnswer(event.results[0][0].transcript);
    };
    recognition.onerror = () => alert("Error in speech recognition.");
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  // Stop Recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Submit Answer for AI feedback
  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please provide an answer.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
      setImprovement(data.improvement);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      alert("Error getting feedback.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-gray-800 text-white">
      <h2 className="text-xl font-semibold mb-4">{industry} Interview</h2>
      {loading ? <p>Loading...</p> : <p className="mb-4 font-medium">Q: {question}</p>}

      <div className="mb-4">
        {isRecording ? (
          <Button variant="destructive" onClick={stopRecording}>Stop Recording</Button>
        ) : (
          <Button onClick={startRecording}><Mic className="h-4 w-4 mr-2" /> Start Recording</Button>
        )}
      </div>

      <textarea
        className="w-full border p-2 rounded text-black"
        rows="3"
        placeholder="Your answer will appear here..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <Button onClick={submitAnswer} className="mt-4">
        {loading ? <Loader2 className="animate-spin" /> : <Send className="h-4 w-4 mr-2" />} Submit Answer
      </Button>

      {feedback && (
        <div className="mt-6 p-4 border rounded bg-gray-100 text-black">
          <h3 className="font-semibold text-green-600 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" /> AI Feedback:
          </h3>
          <p className="mt-2">{feedback}</p>
        </div>
      )}

      {improvement && (
        <div className="mt-4 p-4 border rounded bg-yellow-100 text-black">
          <h3 className="font-semibold text-yellow-700 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" /> Areas of Improvement:
          </h3>
          <p className="mt-2">{improvement}</p>
        </div>
      )}

<Button onClick={fetchQuestion} className="mt-4">
  Next Question
</Button>

    </div>
  );
}
