import { useState, useEffect } from "react";

export function useVoiceToText() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognition = typeof window !== "undefined" && new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
  }, []);

  const startListening = () => {
    if (!recognition) {
      console.error("Speech Recognition not supported.");
      return;
    }
    setTranscript("");
    recognition.start();
  };

  return { transcript, isListening, startListening };
}
