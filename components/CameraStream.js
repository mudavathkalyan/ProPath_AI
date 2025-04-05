"use client";
import { useRef, useEffect } from "react";

export default function CameraStream() {
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();
  }, []);

  return (
    <div className="w-full h-full p-2">
      <video ref={videoRef} autoPlay muted className="rounded-xl shadow-xl w-full h-auto object-cover" />
    </div>
  );
}
