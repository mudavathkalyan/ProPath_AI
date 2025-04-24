"use client";
import { useState, useEffect, useRef } from "react";
import { getFeedback } from "@/app/lib/interviewAPI";
import { Mic, ArrowRight } from "lucide-react";
import { useVoiceToText } from "@/app/hook/useVoiceToText";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export default function InterviewBoard() {
  const industries = [
    "React", "Java", "SQL", "Next.js", "Python", "Node.js", "MongoDB",
    "Express.js", "TypeScript", "HTML & CSS", "JavaScript", "C++", "C",
    "Data Structures", "Algorithms", "System Design", "Operating Systems",
    "Computer Networks", "Machine Learning", "Artificial Intelligence",
    "DevOps", "Cloud Computing", "Cybersecurity", "Blockchain",
    "Docker", "Kubernetes", "Git & GitHub"
  ];

  const [industry, setIndustry] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [completed, setCompleted] = useState(false);
  const [allFeedback, setAllFeedback] = useState([]);
  const videoRef = useRef(null);

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    setTranscript
  } = useVoiceToText();

  useEffect(() => {
    if (transcript && transcript.length > 0) {
      setUserAnswer(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (industry) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
        });
    }
  }, [industry]);

  const fetchQuestions = async (selectedIndustry) => {
    setIndustry(selectedIndustry);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate 10 unique and diverse interview questions for the field of ${selectedIndustry}. Vary the difficulty from easy to hard. Format as a JSON array.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = response.text();

    try {
      const cleanedText = text.replace(/```json|```/g, "").trim();
      const generatedQuestions = JSON.parse(cleanedText);
      setQuestions(generatedQuestions);
    } catch (err) {
      console.error("Failed to parse AI response:", text);
      setQuestions([`Failed to load questions. Please try again.`]);
    }

    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setFeedback("");
    setAllFeedback([]);
    setCompleted(false);
  };

  const submitAnswer = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const response = await getFeedback(userAnswer, currentQuestion);
    setFeedback(response);
    setAllFeedback((prev) => [...prev, { question: currentQuestion, feedback: response }]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setUserAnswer("");
      setTranscript("");
    } else {
      setCompleted(true);
    }
  };
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="w-full">
                <h1 className="text-4xl font-bold mb-6 text-center text-indigo-700">🎯 Interview Board</h1>
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-1">
      
      {/* Camera Section */}
      
      <div className="border rounded-lg overflow-hidden shadow-lg h-[400px] sticky top-4">
      {industry && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-lg"
          ></video>
        )}
      </div>

      {/* Interview Section */}
      <div className="">
        {!industry && (
          <div className="bg-indigo-100 border border-indigo-300 text-indigo-800 p-6 rounded mb-6 text-center animate-pulse shadow-lg">
            <strong className="text-5xl font-extrabold block mb-2"> Unlimited Preparation Hub</strong>
            <p className="text-xl font-medium">Enhance your learning journey with realistic interview practice.<br />
            Don’t wait — <span className="font-bold">select an industry to start now!</span></p>
          </div>
        )}

        <select
          onChange={(e) => fetchQuestions(e.target.value)}
          className="border p-2 my-4 w-full rounded shadow text-lg"
        >
          <option value="">🎓 Select Industry</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>

        {questions.length > 0 && !completed && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-sm text-right text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>

            <div className="border p-4 rounded-lg bg-gray-100 text-black shadow">
              <p className="text-lg\ font-semibold mb-1">🧠 {questions[currentQuestionIndex]?.question}</p>
              <p className="text-sm text-gray-400">🎯 Difficulty: {questions[currentQuestionIndex]?.difficulty}</p>
              <p className="text-sm text-gray-400">📚 Topic: {questions[currentQuestionIndex]?.topic}</p>
            </div>

            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer or speak it..."
              className="w-full border p-2 mt-2 rounded shadow resize-none min-h-[120px]"
            />

            <div className="flex gap-2 mt-2 items-center">
              <button
                onClick={startListening}
                className={`p-2 rounded flex items-center gap-2 transition duration-200 shadow ${isListening ? "bg-red-500" : "bg-blue-500"}`}
              >
                <Mic className="w-5 h-5 text-white" />
                <span className="text-white">{isListening ? "Listening..." : "Speak"}</span>
              </button>

              {isListening && (
                <button
                  onClick={stopListening}
                  className="p-2 rounded bg-gray-800 text-white shadow"
                >
                  Stop
                </button>
              )}
            </div>

            <button
              onClick={submitAnswer}
              className="bg-green-600 hover:bg-green-700 text-white p-3 mt-4 rounded w-full flex items-center justify-center gap-2 shadow-lg transition duration-200"
            >
               Submit & Next <ArrowRight className="w-5 h-5" />
            </button>
            <button
  onClick={stopCamera}
  className="bg-red-600 hover:bg-red-700 text-white p-2 mt-2 rounded w-full flex items-center justify-center gap-2 shadow transition duration-200"
>
  🛑 Stop Interview
</button>

            {feedback && (
              <div className="mt-4 p-4 border rounded bg-yellow-50 space-y-4 shadow-inner animate-slide-up">
                <div>
                  <strong className="block mb-1 text-lg text-yellow-800">🔍 Feedback</strong>
                  <p className="text-gray-800 whitespace-pre-wrap">{feedback.feedback}</p>
                </div>

                <div>
                  <strong className="block mb-1 text-lg text-green-700">✅ Correct Answer</strong>
                  <p className="text-gray-900 whitespace-pre-wrap">{feedback.correctAnswer}</p>
                </div>

                <div>
                  <strong className="block mb-1 text-lg text-blue-700">✅ Suggested Answer</strong>
                  <p className="text-gray-900 whitespace-pre-wrap">{feedback.suggestedAnswer}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {completed && (
          <div className="bg-green-100 text-green-800 p-6 rounded mt-6 shadow-lg text-center text-xl animate-fade-in">
             You've completed the mock interview for <strong>{industry}</strong>!
            <p className="mt-2 text-base">🔥 Great job! Want to try another industry?</p>

            <div className="mt-6 text-left">
              {allFeedback.map((entry, index) => (
                <div key={index} className="mb-6 p-4 border rounded bg-white shadow">
                  <p className="font-bold text-gray-700">Question {index + 1}:</p>
                  <p className="text-gray-900 mb-2">{entry.question.question}</p>

                  <p className="text-yellow-700 mb-1"><strong>🔍 Feedback:</strong> {entry.feedback.feedback}</p>
                  <p className="text-green-700 mb-1"><strong>✅ Correct Answer:</strong> {entry.feedback.correctAnswer}</p>
                  <p className="text-blue-700"><strong>💡 Suggested Answer:</strong> {entry.feedback.suggestedAnswer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    <div className="pt-3 pb-3 w-full text-center text-indigo-700 text-2xl md:text-2xl font-semibold italic mt-8 tracking-wide animate-pulse">
  Keep pushing forward – small steps today lead to big success tomorrow with <span className="font-extrabold text-indigo-900">ProPathAI</span>.
</div>
    </div>

  );
}
