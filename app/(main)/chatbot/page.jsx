"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessage } from "@/actions/chatbot";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentMessage]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    
    setInput("");
    setCurrentMessage("");
  
    // Fetch chatbot response
    const response = await sendMessage(input); // Ensure this returns a string
    let botText = "";
  
    // Simulate real-time text generation
    for (let char of response) {
      botText += char;
      setCurrentMessage(botText);
      await new Promise((resolve) => setTimeout(resolve, 30)); // Adjust delay for smoother effect
    }
  
    const botMessage = { role: "bot", text: botText };
    setMessages((prev) => [...prev, botMessage]);
    setCurrentMessage("");
  };
  
  return (
    <div className="flex flex-col h-screen bg-black text-white items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[80vh] border border-gray-700 rounded-lg bg-gray-900 flex flex-col overflow-hidden">
        <header className="p-4 text-center text-lg font-semibold border-b border-gray bg-gray-900">AI Chatbot</header>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center">Ask me anything and get instant answers to your queries!</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <span className={`px-4 py-2 rounded-lg max-w-xs sm:max-w-md md:max-w-lg ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-900 text-white"}`}>
                  {msg.text}
                </span>
              </div>
            ))
          )}
          {currentMessage && (
            <div className="flex justify-start">
              <span className="px-4 py-2 rounded-lg max-w-xs sm:max-w-md md:max-w-lg bg-gray-900 text-white animate-pulse">
                {currentMessage}
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Field */}
        <div className="p-4 border-t border-gray-700 bg-gray-800 flex items-center gap-2">
          <Input 
            className="flex-1 bg-gray-700 text-white border border-gray-600 focus:ring-0 focus:border-blue-500"
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Give any input..." 
          />
          <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-500">
            <MessageCircle className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
