"use client";
import { useState, useRef } from "react";

export const useVoiceToText = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const initializeRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition();
    }
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    setTranscript, // expose this so we can clear it
  };
};
