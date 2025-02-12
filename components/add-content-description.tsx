"use client";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { AddContentDescriptionProps } from "@/lib/types/add-content-description-props";
export function AddContentDescription({
  blob,
  mediaType,
  onRetake,
  onAddDescription,
}: AddContentDescriptionProps) {
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

  return (
    <div className="h-full flex flex-col space-y-4 items-center overflow-y-auto scroll-smooth">
      <div className="h-3/4 rounded-3xl">
        {mediaType === "image/jpeg" ? (
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
          onClick={() => onAddDescription(description)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
