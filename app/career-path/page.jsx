"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export default function CareerPath() {
  const [domain, setDomain] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Generate a step-by-step career roadmap for becoming a professional in the domain of "${domain}". Each step should include a title and short description. Respond in JSON format: [{ "title": "...", "details": "..." }, ...]`;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();

      const cleaned = response.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
            setRoadmap(
        parsed.map((step, index) => ({
          id: index + 1,
          title: step.title,
          details: step.details,
          icon: "🎯",
        }))
      );
    } catch (err) {
      console.error(err);
      setError("❗Something went wrong. Try a different domain or check your internet connection.");
      setRoadmap([]);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        🎯 Personalized Career Path Generator
      </h1>
      <div className="flex gap-4 w-full mb-6">
        <Input
          type="text"
          placeholder="Enter your desired domain (e.g. AI, DevOps, Web Dev)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <Button onClick={handleGenerate}>Generate</Button>
      </div>
      {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}

      <div className="relative w-full min-h-[600px] mt-6 flex flex-col items-center">
        {roadmap.map((level, index) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.3 }}
            className="relative z-10 bg-gradient-to-br from-indigo-100 to-white shadow-2xl rounded-3xl px-8 py-6 mb-20 w-[75%] text-center border-4 border-indigo-500"
          >
            <div className="text-4xl mb-2">{level.icon}</div>
            <div className="text-xl font-bold text-indigo-800">{level.title}</div>
            {expanded === level.id && (
              <div className="mt-2 text-gray-700 text-sm italic">{level.details}</div>
            )}
            <button
              className="mt-3 text-sm text-indigo-600 underline hover:text-indigo-800"
              onClick={() => setExpanded(expanded === level.id ? null : level.id)}
            >
              {expanded === level.id ? "Show Less" : "Read More"}
            </button>
            {index !== roadmap.length - 1 && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 h-16 w-1 bg-indigo-400 z-0"></div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
