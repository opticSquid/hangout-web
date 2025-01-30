"use client";
import { DefaultView } from "@/components/create-post-default-view";

export default function CreatePost() {
  function onImageCaptured(imageBlob: Blob) {
    console.log("image captured");
  }
  return <DefaultView onMediaCaptured={onImageCaptured} />;
}
