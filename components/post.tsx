"use client";
import type { PostObject } from "@/lib/types/post-interface";
import { PostOwner } from "@/lib/types/post-owner-interface";
import { useState } from "react";
import { PostInteractions } from "./post-interactions";
import { PostOwnerInfo } from "./post-owner-info";
import { Button } from "./ui/button";
import { VideoPlayer } from "./video-player";

export function Post(post: PostObject) {
  const words: string[] | undefined = post.postDescription?.split(" ");
  const [isExpanded, setIsExpanded] = useState(false);
  let previewText: string | undefined = words?.slice(0, 10).join(" ");
  if (words && words?.length > 10) {
    previewText += "...";
  }
  const toggleText = (): void => {
    setIsExpanded(!isExpanded);
  };
  const postOwner: PostOwner = {
    name: "Soumalya Bhattacharya",
    photo: "https://github.com/shadcn.png",
    category: "Visual Artist",
    location: post.location,
  };
  return (
    <div className="flex flex-col relative">
      <PostOwnerInfo {...postOwner} />
      <VideoPlayer dashSrc={post.media} autoPlay={false} />
      {post.postDescription ? (
        <span
          className={`pl-2 pr-2 pt-1 ${
            isExpanded ? "max-h-48 overflow-y-auto" : "max-h-14"
          }`}
        >
          {isExpanded ? post?.postDescription : previewText}
          <Button variant="link" onClick={toggleText}>
            <span className="font-bold">
              {isExpanded ? "collapse" : "read more"}
            </span>
          </Button>
        </span>
      ) : null}
      <div className="text-xs text-neutral-500 pl-2 font-semibold">7m ago</div>
      <PostInteractions postId={post.postId} />
    </div>
  );
}
