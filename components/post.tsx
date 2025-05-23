"use client";
import { getTimeDifferenceFromUTC } from "@/lib/time-difference";
import { PostOwner } from "@/lib/types/post-owner-interface";
import { PostControls } from "@/lib/types/PostControls";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { PhotoViewer } from "./photo-viewer";
import { PostInteractions } from "./post-interactions";
import { PostOwnerInfo } from "./post-owner-info";
import { Button } from "./ui/button";
import { ProfileData } from "@/lib/types/get-profile-response";
const ShakaContainer = dynamic(() => import("@/components/shaka-player-new"), {
  ssr: false,
});
export function Post({ post, canPlayVideo, showDistance }: PostControls) {
  const words: string[] | undefined = post.postDescription?.split(" ");
  const [isExpanded, setIsExpanded] = useState(false);
  let previewText: string | undefined = words?.slice(0, 10).join(" ");
  const wordLimit = 10;
  if (words && words?.length > wordLimit) {
    previewText += "...";
  }
  const toggleText = (): void => {
    setIsExpanded(!isExpanded);
  };
  const [postOwner, setPostOwner] = useState<PostOwner>({
    name: "",
    photo: "",
    state: post.state,
    city: post.city,
    distance: post.distance,
    location: post.location,
  });
  useEffect(() => {
    async function fetchProfile() {
      const profileResponse: Response = await fetch(
        `${process.env.NEXT_PUBLIC_PROFILE_API_URL}/profile/${post.ownerId}`
      );
      const profileData: ProfileData = await profileResponse.json();
      setPostOwner((p) => {
        return {
          ...p,
          name: profileData.name,
          photo: profileData.profilePicture.filename,
        };
      });
    }
    fetchProfile();
  }, [post.ownerId]);
  return (
    <div className="flex flex-col">
      <PostOwnerInfo owner={postOwner} showDistance={showDistance} />
      {post.contentType.startsWith("video/") ? (
        <ShakaContainer filename={post.filename} autoPlay={canPlayVideo} />
      ) : (
        <PhotoViewer
          filename={post.filename}
          rounded={false}
          radius={undefined}
        />
      )}

      {post.postDescription ? (
        <span
          className={`pl-2 pr-2 pt-1 ${
            isExpanded ? "max-h-48 overflow-y-auto" : "max-h-14"
          }`}
        >
          {isExpanded ? post?.postDescription : previewText}
          {words && words?.length > wordLimit && (
            <Button variant="link" onClick={toggleText}>
              <span className="font-bold">
                {isExpanded ? "collapse" : "read more"}
              </span>
            </Button>
          )}
        </span>
      ) : null}
      <div className="text-xs text-neutral-500 pl-2 font-semibold">
        {getTimeDifferenceFromUTC(post.createdAt)}
      </div>
      <PostInteractions
        postId={post.postId}
        heartCount={post.hearts}
        commentCount={post.comments}
        interactionCount={post.interactions}
      />
    </div>
  );
}
