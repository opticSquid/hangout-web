"use client";
import { DefaultView } from "@/components/create-post-default-view";

export default function CreatePost() {
  function onMediaCaptured(mediaBlob: Blob) {
    console.log("media captured");
  }
  return <DefaultView onMediaCaptured={onMediaCaptured} />;
}
