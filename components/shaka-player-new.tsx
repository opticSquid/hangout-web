import { useEffect, useRef, useState } from "react";
import { VideoPlayerProps } from "@/lib/types/video-player-interface";
import { ShakaError } from "@/lib/types/shaka-error";
import "shaka-player/dist/controls.css";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const shaka = require("shaka-player/dist/shaka-player.ui.js");

export default function ShakaPlayer({ filename, autoPlay }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const extractedFilename = filename.replace(/\.[^.]+$/, "");
  const [videoNotAvailable, setVideoNotAvailable] = useState<boolean>(false);
  useEffect(() => {
    if (!videoRef.current || !containerRef.current) return;

    const player = new shaka.Player();
    player.attach(videoRef.current);
    new shaka.ui.Overlay(player, containerRef.current, videoRef.current);

    const onError = (error: ShakaError) => {
      if (error.code === 7002) {
        console.warn("Ignoring Shaka timeout error:", error);
        return; // Do nothing
      } else if (error.code === 1003) {
        setVideoNotAvailable(true);
      } else {
        console.error("something wrong with shaka player: ", error);
      }
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

  return videoNotAvailable ? (
    <Card>
      <CardHeader>
        <CardTitle>Content Not Available</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          Content may be under processing or is not available at this time.
          Please try again later
        </div>
      </CardContent>
    </Card>
  ) : (
    <div data-shaka-player-container ref={containerRef}>
      <video
        data-shaka-player
        autoPlay={autoPlay}
        loop
        id="video"
        ref={videoRef}
        className="flex-1 w-[100vw] aspect-9/16 object-cover"
      />
    </div>
  );
}
