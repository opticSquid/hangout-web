"use client";
import type { Post } from "@/types/post-interface";
import { VideoPlayer } from "./video-player";
import { Button } from "./ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

export function Post(post: Post) {
  const words: string[] | undefined = post.content?.split(" ");
  const [isExpanded, setIsExpanded] = useState(false);
  const previewText: string | undefined = words?.slice(0, 10).join(" ");
  const toggleText = (): void => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div className="flex flex-col border-b">
      <div>
        <VideoPlayer dashSrc={post.media} autoPlay={false} />
      </div>
      <div
        className={`mt-1 text-sm ${
          isExpanded ? "max-h-[none]" : "max-h-[200px] overflow-y-auto"
        }`}
      >
        {isExpanded ? post?.content : previewText + "..."}
        <Button variant="link" onClick={toggleText}>
          <span className="font-bold">
            {isExpanded ? "collapse" : "read more"}
          </span>
        </Button>
      </div>
      <div className="flex flex-row">
        <Button variant="ghost" size="icon">
          <Heart />
        </Button>
        <Button variant="ghost" size="icon">
          <MessageCircle />
        </Button>
        <div className="grow" />
        <Button variant="ghost" size="icon">
          <Share2 />
        </Button>
      </div>
    </div>
  );
}
