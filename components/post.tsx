"use client";
import { PostOwner } from "@/lib/types/post-owner-interface";
import { PostControls } from "@/lib/types/PostControls";
import dynamic from "next/dynamic";
import { useState } from "react";
import { PostInteractions } from "./post-interactions";
import { PostOwnerInfo } from "./post-owner-info";
import { Button } from "./ui/button";
const ShakaContainer = dynamic(() => import("./shaka-player"), { ssr: false });
export function Post({ post, canPlayVideo }: PostControls) {
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
    state: post.state,
    city: post.city,
    distance: post.distance,
  };
  return (
    <div className="flex flex-col relative">
      <PostOwnerInfo {...postOwner} />
      {post.contentType.startsWith("video/") ? (
        <ShakaContainer filename={post.filename} autoPlay={canPlayVideo} />
      ) : null}

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
