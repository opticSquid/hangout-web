"use client";
import { VideoPlayerProps } from "@/lib/types/video-player-interface";
import React, { useEffect } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
export function VideoJsPlayer(videoPlayerProps: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<Player | null>(null);
  // extract filename without extension
  const extractedFilename = videoPlayerProps.filename.replace(/\.[^.]+$/, "");
  useEffect(() => {
    const playerOptions = {
      autoplay: videoPlayerProps.autoPlay,
      preload: "auto",
      enableSmoothSeeking: true,
      experimentalSvgIcons: true,
      nativeControlsForTouch: true,
      noUITitleAttributes: true,
      loop: true,
      controls: true,
      fluid: true,
      responsive: true,
      sources: [
        {
          src: `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/${extractedFilename}/${extractedFilename}.mpd`,
          type: "application/dash+xml",
        },
      ],
      userActions: {
        click: true,
      },
    };
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-9-16");
      videoRef.current.appendChild(videoElement);
      playerRef.current = videojs(videoElement, playerOptions);
    }
  }, [extractedFilename, videoPlayerProps.autoPlay]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);
  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
}
