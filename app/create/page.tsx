"use client";
import { AddContentDescription } from "@/components/add-content-description";
import { ShootMedia } from "@/components/shoot-media";
import { useSessionContext } from "@/lib/hooks/session-provider";
import { MediaType } from "@/lib/types/accepted-media-type";
import dynamic from "next/dynamic";
import { useState } from "react";

const AddLocationContainer = dynamic(
  () => import("@/components/add-content-location"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);
export default function CreatePost() {
  const [sessionState] = useSessionContext();
  const [step, setStep] = useState<number>(1);
  const [media, setMedia] = useState<Blob | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [description, setDescription] = useState<string>();
  function proceedToNextStep() {
    setStep((prevState: number) => prevState + 1);
  }
  function onMediaCaptured(mediaBlob: Blob) {
    setMedia(mediaBlob);
    setMediaType(mediaBlob.type as MediaType);
    proceedToNextStep();
  }
  function onRetake() {
    setMedia(null);
    setMediaType(null);
    setStep(1);
  }
  function onAddDescription(description: string) {
    setDescription(description);
    proceedToNextStep();
  }

  async function onSubmit(
    lat: number,
    lon: number,
    state: string,
    city: string
  ) {
    const url = description
      ? `${process.env.NEXT_PUBLIC_POST_API_URL}/post/full`
      : `${process.env.NEXT_PUBLIC_POST_API_URL}/post/short`;

    const formData = new FormData();
    const jsonOptions = { type: "application/json" };

    console.log("Original blob type: ", media?.type);

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
      formData.append(
        "postDescription",
        new Blob([JSON.stringify(description)], jsonOptions)
      );
    }

    for (const [key, value] of formData.entries()) {
      if (value instanceof Blob) {
        console.log(`FormData entry [${key}]:`, value, "Type:", value.type);
      } else {
        console.log(`FormData entry [${key}]:`, value);
      }
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionState.accessToken}`,
      },
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
      console.log(
        `case 2, media size: ${media?.size}, media type: ${mediaType}`
      );
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
        setStep(1);
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
