"use client";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import Link from "next/link";
import { PostInteraction } from "@/lib/types/post-interaction-interface";
import { usePathname } from "next/navigation";

export function PostInteractions(postInteraction: PostInteraction) {
  const router = usePathname();
  const activeButtonStyle: string =
    "bg-primaryContainer text-onPrimaryContainer rounded-full";
  const idleButtonStyle: string = "bg-transparent text-primary rounded-full";
  const [isLoved, setIsLoved] = useState(false);
  const toggleIsLoved = (): void => {
    setIsLoved(!isLoved);
  };
  return (
    <div className="flex flex-row pl-2 space-x-1">
      <Button
        key={isLoved ? 1 : 0}
        variant="ghost"
        size="icon"
        className={isLoved ? activeButtonStyle : idleButtonStyle}
        onClick={toggleIsLoved}
      >
        <Heart />
      </Button>
      {router === `/comments/${postInteraction.postId}` ? (
        <Button variant="link" size="icon" className={activeButtonStyle}>
          <MessageCircle />
        </Button>
      ) : (
        <Button variant="link" size="icon" className={idleButtonStyle}>
          <Link href={`/comments/${postInteraction.postId}`}>
            <MessageCircle />
          </Link>
        </Button>
      )}

      <div className="grow" />
      <Button variant="ghost" size="icon">
        <Share2 />
      </Button>
    </div>
  );
}
