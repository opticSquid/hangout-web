import { useEffect, useRef } from "react";
import { VideoPlayerProps } from "@/lib/types/video-player-interface";
import { ShakaError } from "@/lib/types/shaka-error";
import "shaka-player/dist/controls.css";

const shaka = require("shaka-player/dist/shaka-player.ui.js");

export default function ShakaPlayer({ filename, autoPlay }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const extractedFilename = filename.replace(/\.[^.]+$/, "");

  useEffect(() => {
    if (!videoRef.current || !containerRef.current) return;

    const player = new shaka.Player();
    player.attach(videoRef.current);
    new shaka.ui.Overlay(player, containerRef.current, videoRef.current);

    const onError = (error: ShakaError) => {
      if (error.code === 7002) {
        console.warn("Ignoring Shaka timeout error:", error);
        return; // Do nothing
      }
      console.error("something wrong with shaka player: ", error);
    };

    player
      .load(
        `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/${extractedFilename}/${extractedFilename}.mpd`
      )
      .then(() => console.log("The video has now been loaded!"))
      .catch(onError);

    return () => {
      player.destroy().catch(console.error);
    };
  }, [extractedFilename]);

  useEffect(() => {
    if (autoPlay) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [autoPlay]);

  return (
    <div data-shaka-player-container ref={containerRef}>
      <video
        data-shaka-player
        autoPlay={autoPlay}
        loop
        id="video"
        ref={videoRef}
        className="h-full w-full"
      />
    </div>
  );
}
