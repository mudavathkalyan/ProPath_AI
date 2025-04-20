"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function CareerPath() {
  const [domain, setDomain] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setSelectedId(null);
    try {
      const prompt = `Generate a step-by-step career roadmap for becoming a professional in the domain of "${domain}". Each step should include a title and short description. Respond in JSON format: [{ "title": "...", "details": "..." }, ...]`;

      const result = await model.generateContent(prompt);
      let text = await result.response.text();
      text = text.replace(/```json|```/g, "");
      const parsed = JSON.parse(text);
      setRoadmap(parsed);
    } catch (error) {
      alert("Something went wrong. Try another domain.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-purple-400 py-12 px-6 overflow-y-scroll scrollbar-hide">
      <style>{`
        /* Hide scrollbar but allow scrolling */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE & Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>

      <h1 className="text-2xl font-bold text-center pt-10 text-violet-600">
        <MapPin className="inline mr-2 animate-pulse text-red-500 pt-28" />
        Your journey begins today-Take the first step toward your future
      </h1>

      <div className="max-w-xl mx-auto flex gap-2 mb-10 text-black">
        <Input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter your career domain (e.g.,next.js,java,python...)"
        />
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Thinking..." : "Generate"}
        </Button>
      </div>

      {roadmap.length > 0 && (
        <div className="relative mx-auto max-w-5xl pb-10">
          {/* Start Node */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-full p-4 shadow-md border-4 border-green-400 relative"
            >
              <MapPin className="text-red-500 w-10 h-10 animate-bounce" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-12 bg-gray-400"></div>
            </motion.div>
          </div>

          {/* Roadmap Nodes */}
          <div className="flex flex-col items-center relative">
            {roadmap.map((step, index) => (
              <div key={index} className="relative z-10">
                {/* Tooltip Title on Hover */}
                <AnimatePresence>
                {hoveredId === index && (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: -10 }}
    exit={{ opacity: 0, scale: 0.8, y: 20 }}
    transition={{ type: "spring", duration: 0.5 }}
    className="absolute -top-16 left-1/2 -translate-x-1/2 w-max max-w-xs bg-white px-4 py-2 text-sm text-violet-800 border border-violet-300 rounded-xl shadow-lg z-50"
  >
    <div className="relative">
      <span className="block">{step.title}</span>
      {/* Tail-style triangle */}
      <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-b border-violet-300 rotate-45 z-0"></div>
    </div>
  </motion.div>
)}

                </AnimatePresence>

                {/* Level Node */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 6 }}
                  whileTap={{ scale: 1.05 }}
                  onMouseEnter={() => setHoveredId(index)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedId(index)}
              className="cursor-pointer rounded-full bg-violet-600 text-white w-14 h-14 flex items-center justify-center shadow-xl border-4 border-white transition-all duration-300 hover:bg-violet-700">
                  {index + 1}
                </motion.div>

                {/* Connector */}
                {index !== roadmap.length - 1 && (
                  <div className="w-1 bg-gray-300 h-20 mx-auto"></div>
                )}

                {/* Detail Blast */}
                <AnimatePresence>
                  {selectedId === index && (
                    <motion.div
                      key={`details-${index}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className={`absolute top-0 ${index % 2 === 0 ? "left-20" : "right-20"} bg-white w-72 p-5 rounded-xl shadow-lg border-l-4 border-violet-500`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-yellow-500 animate-spin" />
                        <h3 className="text-lg font-semibold text-violet-700">{step.title}</h3>
                      </div>
                      <p className="text-sm text-gray-700">{step.details}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <h2 className="text-center font-bold text-2xl pt-12 text-violet-600"> 🏁 You’ve unlocked the path—now conquer the world...</h2>
        </div>
      )}
      
    </div>
  );
}
