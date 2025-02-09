"use client";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
export function PostContent({
  blob,
  type,
  onRetake,
}: {
  blob: Blob;
  type: "image/jpeg" | "video/webm";
  onRetake: () => void;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  useEffect(() => {
    if (blob) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setDataUrl(reader.result as string); // Type assertion for string
      };

      reader.readAsDataURL(blob);

      return () => {
        // Cleanup: Abort the reader if the component unmounts
        reader.abort();
      };
    } else {
      setDataUrl(null);
    }
  }, [blob]);

  if (!dataUrl) {
    return <div>Loading...</div>;
  }
  async function onSubmit() {
    const url: string = description
      ? `${process.env.NEXT_PUBLIC_POST_API_URL}/post/full`
      : `${process.env.NEXT_PUBLIC_POST_API_URL}/post/short`;
    const formData = new FormData();
    formData.append(
      "file",
      blob,
      type === "image/jpeg" ? "uploaded-media.jpg" : "uploaded-media.webm"
    );
    if (description) {
      formData.append("postDescription", description);
    }
    //TODO: add lat, lon, state, city
  }
  return (
    <div className="h-full flex flex-col space-y-4 items-center">
      <div className="h-3/4 rounded-3xl">
        {type === "image/jpeg" ? (
          <img
            src={dataUrl}
            alt="uploaded media"
            className="h-full object-cover"
          />
        ) : (
          <video
            controls={true}
            autoPlay={true}
            loop={true}
            className="h-full object-cover"
            src={dataUrl}
          />
        )}
      </div>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={117}
        placeholder="describe your post (optional)"
        className="w-11/12 bg-secondary"
      />
      <div className="flex flex-row justify-between items-center w-14/15 space-x-2">
        <Button variant="secondary" size="icon" onClick={onRetake}>
          <RotateCcw />
        </Button>
        <Button
          size="default"
          className="grow rounded-3xl bg-primaryButton text-primary-foreground"
        >
          Post
        </Button>
      </div>
    </div>
  );
}
