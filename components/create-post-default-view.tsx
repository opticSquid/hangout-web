"use client";

import { MediaCaptureProps } from "@/lib/types/media-capture-props";
import { Circle, CircleStop, FolderOpen, SwitchCamera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

export function DefaultView({ onMediaCaptured }: MediaCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const stream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [mode, setMode] = useState<"photo" | "video">("video");
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState("0:00");
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /** Start the camera */
  const startCamera = async () => {
    try {
      // Stop any existing stream before starting a new one
      stopCamera();

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: mode === "video", // Enable audio only for video mode
      });

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }

      stream.current = newStream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  /** Stop the camera */
  const stopCamera = () => {
    if (stream.current) {
      stream.current.getTracks().forEach((track) => track.stop());
      stream.current = null;
    }
  };

  /** Capture an image using MediaStream */
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
        console.log("photo captured");
        onMediaCaptured(blob);
      }, "image/jpeg");
    }
  };

  /** Start recording using MediaRecorder */
  const startRecording = () => {
    if (!stream.current) return;

    const recorder = new MediaRecorder(stream.current, {
      mimeType: "video/webm",
    });
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.current.push(event.data);
    };

    recorder.onstop = () => {
      const videoBlob = new Blob(recordedChunks.current, {
        type: "video/webm",
      });
      onMediaCaptured(videoBlob);
      recordedChunks.current = [];
      mediaRecorder.current = null;
      setRecording(false);
      clearInterval(timerIntervalRef.current as NodeJS.Timeout); // Clear the timer
      setTimer("0:00"); // Reset the timer display
      console.log("video captured");
    };

    recorder.start();
    mediaRecorder.current = recorder;
    setRecording(true);
    startTimer(); // Start the timer when recording begins
  };

  const startTimer = () => {
    let seconds = 0;
    let minutes = 0;
    timerIntervalRef.current = setInterval(() => {
      seconds++;
      console.log("+1 sec");
      if (seconds === 60) {
        console.log("1 min done");
        minutes++;
        seconds = 0;
        stopRecording();
      }
      const formattedTime = `${minutes.toString().padStart(1, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
      setTimer(formattedTime);
    }, 1000);
  };

  /** Stop recording */
  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  };

  /** Switch camera */
  const switchCamera = () => {
    setFacingMode((prevState) =>
      prevState === "user" ? "environment" : "user"
    );
  };

  /** Restart camera on mode change */
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode, mode]);

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      {recording && (
        <div className="absolute top-1 bg-black/50 rounded-xl px-2 py-1 z-10 font-light">
          <div className="flex flex-row items-center space-x-1 animate-pulse">
            <Circle fill="red" size="12" />
            <span>{timer}</span>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-auto max-w-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />

      <div className="absolute bottom-20 w-5/6 flex flex-col space-y-6">
        <div className="flex flex-row justify-center">
          <Button
            size="sm"
            variant={mode === "photo" ? "default" : "ghost"}
            className="rounded-xl"
            onClick={() => setMode("photo")}
          >
            Photo
          </Button>
          <Button
            size="sm"
            variant={mode === "video" ? "default" : "ghost"}
            className="rounded-xl"
            onClick={() => setMode("video")}
          >
            Video
          </Button>
        </div>

        <div className="flex justify-between">
          <Button variant="ghost" size="icon">
            <FolderOpen size={36} />
          </Button>

          {mode === "photo" ? (
            <Button onClick={captureImage} variant="ghost" size="icon">
              <Circle size={60} />
            </Button>
          ) : recording ? (
            <Button onClick={stopRecording} variant="ghost" size="icon">
              <CircleStop size={60} stroke="red" />
            </Button>
          ) : (
            <Button onClick={startRecording} variant="ghost" size="icon">
              <Circle size={60} fill="red" />
            </Button>
          )}

          <Button onClick={switchCamera} variant="ghost" size="icon">
            <SwitchCamera size={36} />
          </Button>
        </div>
      </div>
    </div>
  );
}
