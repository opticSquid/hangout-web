"use client";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import Link from "next/link";
import { PostInteraction } from "@/types/post-interaction-interface";

export function PostInteractions(postInteraction: PostInteraction) {
  const activeButtonStyle: string =
    "bg-primaryContainer text-onPrimaryContainer rounded-full";
  const idleButtonStyle: string = "bg-transparent text-primary rounded-full";
  const [isLoved, setIsLoved] = useState(false);
  const toggleIsLoved = (): void => {
    setIsLoved(!isLoved);
  };
  return (
    <div className="flex flex-row pl-2">
      <Button
        key={isLoved ? 1 : 0}
        variant="ghost"
        size="icon"
        className={isLoved ? activeButtonStyle : idleButtonStyle}
        onClick={toggleIsLoved}
      >
        <Heart />
      </Button>
      <Button variant="link" size="icon">
        <Link href={`/posts/${postInteraction.postId}/comments`}>
          <MessageCircle />
        </Link>
      </Button>
      <div className="grow" />
      <Button variant="ghost" size="icon">
        <Share2 />
      </Button>
    </div>
  );
}
