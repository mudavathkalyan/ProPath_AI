"use client";
import { useState } from "react";
import { getQuestions, getFeedback } from "@/app/lib/interviewAPI";
import { Mic, ArrowRight } from "lucide-react";
import { useVoiceToText } from "@/app/hook/useVoiceToText";

export default function InterviewBoard() {
  const industries = ["React", "Java", "SQL", "Next.js", "Python"];
  const [industry, setIndustry] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const { transcript, isListening, startListening } = useVoiceToText();

  // Fetch questions when an industry is selected
  const fetchQuestions = async (selectedIndustry) => {
    setIndustry(selectedIndustry);
    const fetchedQuestions = await getQuestions(selectedIndustry);
    setQuestions(fetchedQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setFeedback("");
  };

  // Submit answer & get feedback
  const submitAnswer = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
  
    const response = await getFeedback(userAnswer, currentQuestion);
    setFeedback(response);  // 🔥 FIXED: Now stores both `feedback` and `correctAnswer`
  
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
    } else {
      console.log("✅ Interview completed!");
    }
  };
  
  
  
  

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold">Interview Board</h1>

      {/* Industry Selection */}
      <select
        onChange={(e) => fetchQuestions(e.target.value)}
        className="border p-2 my-4 w-full"
      >
        <option value="">Select Industry</option>
        {industries.map((ind) => (
          <option key={ind} value={ind}>
            {ind}
          </option>
        ))}
      </select>

      {/* Question & Answer Section */}
      {questions.length > 0 && (
        <>
          <div className="border p-4 rounded-lg bg-gray-100 text-black">
            <p className="font-medium">{questions[currentQuestionIndex]}</p>
          </div>

          {/* Answer Input */}
          <textarea
            value={transcript || userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer or speak it..."
            className="w-full border p-2 mt-2"
          />

          {/* Voice Input Button */}
          <button
            onClick={startListening}
            className={`p-2 my-2 rounded ${isListening ? "bg-red-500" : "bg-blue-500"}`}
          >
            <Mic className="w-5 h-5 text-white" />
            {isListening ? "Listening..." : "Speak"}
          </button>

          {/* Submit Button */}
          <button
            onClick={submitAnswer}
            className="bg-green-500 text-white p-2 mt-2 rounded w-full"
          >
            Submit & Next <ArrowRight className="inline-block w-5 h-5" />
          </button>

          {/* Feedback Section */}
          {feedback && (
  <div className="mt-4 p-4 border rounded bg-yellow-50 space-y-4">
    <div>
      <strong className="block mb-1 text-lg text-yellow-800">🔍 Feedback</strong>
      <p className="text-gray-800 whitespace-pre-wrap">{feedback.feedback}</p>
    </div>

    <div>
      <strong className="block mb-1 text-lg text-green-700"></strong>
      <p className="text-gray-900 whitespace-pre-wrap">{feedback.correctAnswer}</p>
    </div>
  </div>
)}

        </>
      )}
    </div>
  );
}
