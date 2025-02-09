"use client";
import { PostContent } from "@/components/post-content";
import { ShootMedia } from "@/components/shoot-photo-or-video";
import { useState } from "react";

export default function CreatePost() {
  const [media, setMedia] = useState<Blob | null>(null);
  const [mediaType, setMediaType] = useState<
    "image/jpeg" | "video/webm" | null
  >(null);
  function onMediaCaptured(mediaBlob: Blob) {
    setMedia(mediaBlob);
    if (mediaBlob.type === "image/jpeg") {
      setMediaType("image/jpeg");
    } else if (mediaBlob.type === "video/webm") {
      setMediaType("video/webm");
    } else {
      setMediaType(null);
    }
  }
  function onRetake() {
    setMedia(null);
    setMediaType(null);
  }
  return media && mediaType ? (
    <PostContent blob={media} type={mediaType} onRetake={onRetake} />
  ) : (
    <ShootMedia onMediaCaptured={onMediaCaptured} />
  );
}
