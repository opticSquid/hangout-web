"use client";

import { MediaCaptureProps } from "@/lib/types/image-capture-props";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Circle, FolderOpen, SwitchCamera } from "lucide-react";

export function DefaultView({
  onMediaCaptured: onImageCaptured,
}: MediaCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Function to start the camera
  const startCamera = async () => {
    try {
      if (stream) return; // Prevent multiple streams

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

  // Function to capture and pass image to onImageCaptured
  const captureImage = async () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) return;
        onImageCaptured(blob); // Call the passed function with captured blob
      }, "image/jpeg");
    }
  };
  // Function to stop the camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    setFacingMode((prevState) =>
      prevState === "user" ? "environment" : "user"
    );
  };

  // Handle tab visibility change (pause when minimized or switched)
  useEffect(() => {
    console.log("visibility state changed to: ", document.visibilityState);
    switch (document.visibilityState) {
      case "visible":
        startCamera();
        break;
      case "hidden":
        stopCamera();
        break;
      default:
        console.error("document visibility state not supported");
    }
    // document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => stopCamera();
    //   document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [document.visibilityState]);

  // Start camera when component mounts or facingMode changes
  useEffect(() => {
    startCamera();
    return () => stopCamera(); // Stop camera when component unmounts
  }, [facingMode]); // Only re-run when facingMode changes

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="h-full w-auto max-w-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute bottom-20 w-5/6 flex flex-row justify-between">
        <Button
          className="px-4 py-2 text-white rounded-lg shadow-md"
          variant="ghost"
          size="icon"
        >
          <FolderOpen size={48} />
        </Button>
        <Button
          onClick={captureImage}
          className="px-4 py-2 text-white rounded-lg shadow-md"
          variant="ghost"
          size="icon"
        >
          <Circle size={48} />
        </Button>
        <Button
          onClick={switchCamera}
          className="px-4 py-2 text-white rounded-lg shadow-md"
          variant="ghost"
          size="icon"
        >
          <SwitchCamera size={48} />
        </Button>
      </div>
    </div>
  );
}
