"use client";

import { useEffect, useRef, useState } from "react";

const CameraCapture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const startCamera = async () => {
    if (stream) {
      stopCamera();
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }

      setStream(newStream);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Handle tab switch, minimize, or page visibility change
  const handleVisibilityChange = () => {
    if (document.hidden) {
      stopCamera(); // Stop camera if tab is hidden or minimized
    } else {
      startCamera(); // Restart camera when user returns
    }
  };
  useEffect(() => {
    startCamera();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopCamera();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [facingMode]);

  const captureImage = async () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const formData = new FormData();
        formData.append("file", blob, "capture.jpg");

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            console.log("Upload successful!");
          } else {
            console.error("Upload failed");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }, "image/jpeg");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-md rounded-lg shadow-md"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex space-x-4">
        <button
          onClick={() =>
            setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
          }
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
        >
          Switch Camera
        </button>
        <button
          onClick={captureImage}
          className="px-4 py-2 bg-green-500 rounded-lg shadow-md"
        >
          Capture Image
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
