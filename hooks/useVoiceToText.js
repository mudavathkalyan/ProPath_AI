"use client";

import { useState, useEffect } from "react";

export function useVoiceToText() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  let recognition = null;

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        setText(event.results[0][0].transcript);
      };
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  return { text, isListening, startListening };
}
