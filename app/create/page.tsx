"use client";
import { AddContentDescription } from "@/components/add-content-description";
import { ShootMedia } from "@/components/shoot-media";
import { useSessionStore } from "@/lib/hooks/session-provider";
import { AddLocationProps } from "@/lib/types/add-location-props";
import dynamic from "next/dynamic";
import { useState } from "react";

const AddLocationContainer = dynamic(
  () => import("@/components/add-location"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);
export default function CreatePost() {
  const { accessToken } = useSessionStore((state) => state);
  const [step, setStep] = useState<number>(1);
  const [media, setMedia] = useState<Blob | null>(null);
  const [mediaType, setMediaType] = useState<
    "image/jpeg" | "video/webm" | null
  >(null);
  const [description, setDescription] = useState<string>();
  function proceedToNextStep() {
    setStep((prevState: number) => prevState + 1);
  }
  function onMediaCaptured(mediaBlob: Blob) {
    setMedia(mediaBlob);
    if (mediaBlob.type === "image/jpeg") {
      setMediaType("image/jpeg");
    } else if (mediaBlob.type === "video/webm") {
      setMediaType("video/webm");
    } else {
      setMediaType(null);
    }
    proceedToNextStep();
  }
  function onRetake() {
    setMedia(null);
    setMediaType(null);
    setStep(1);
  }
  function onAddDescription(description: string) {
    console.log("add description called");
    setDescription(description);
    proceedToNextStep();
  }
  async function onSubmit(
    lat: number,
    lon: number,
    state: string,
    city: string
  ) {
    const url: string = description
      ? `${process.env.NEXT_PUBLIC_POST_API_URL}/post/full`
      : `${process.env.NEXT_PUBLIC_POST_API_URL}/post/short`;
    const formData = new FormData();
    formData.append(
      "file",
      media!,
      mediaType === "image/jpeg" ? "uploaded-media.jpg" : "uploaded-media.webm"
    );
    formData.append("lat", lat.toString());
    formData.append("lon", lon.toString());
    formData.append("state", state);
    formData.append("city", city);
    if (description) {
      formData.append("postDescription", description);
    }
    const response: Response = await fetch(url, {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
      }),
      body: formData,
    });
    if (!response.ok) {
      alert("Posting Failed");
    }
  }
  switch (step) {
    case 1: {
      return <ShootMedia onMediaCaptured={onMediaCaptured} />;
    }
    case 2: {
      if (media && mediaType) {
        return (
          <AddContentDescription
            blob={media}
            mediaType={mediaType}
            onRetake={onRetake}
            onAddDescription={onAddDescription}
          />
        );
      } else {
        return <ShootMedia onMediaCaptured={onMediaCaptured} />;
      }
    }
    case 3: {
      return <AddLocationContainer onSubmit={onSubmit} />;
    }
    default: {
      return <div>Not Allowed</div>;
    }
  }
}
