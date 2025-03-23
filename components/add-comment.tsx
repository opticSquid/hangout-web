"use client";
import { useSessionContext } from "@/lib/hooks/session-provider";
import { AddCommentRequest } from "@/lib/types/add-comment-request";
import { SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { AddCommentInterface } from "@/lib/types/add-comment-interface";
import { ProfileData } from "@/lib/types/get-profile-response";
import { PhotoViewer } from "./photo-viewer";

export function AddComment({
  type,
  postId,
  revalidateCommentAction,
  parentCommentId,
}: AddCommentInterface) {
  const [sessionState] = useSessionContext();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>();
  useEffect(() => {
    if (sessionState.userId) {
      async function fetchProfile() {
        const profileResponse: Response = await fetch(
          `${process.env.NEXT_PUBLIC_PROFILE_API_URL}/profile/${sessionState.userId}`,
          {
            headers: new Headers({
              "Content-Type": "application/json",
            }),
          }
        );
        const profileData: ProfileData = await profileResponse.json();
        setProfileData(profileData);
      }
      fetchProfile();
    }
  }, [sessionState.userId]);
  async function onSubmit() {
    setLoading(true);
    if (!parentCommentId) {
      const newComment: AddCommentRequest = {
        postId: postId,
        comment: comment,
      };
      await fetch(`${process.env.NEXT_PUBLIC_POST_API_URL}/comment`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${sessionState.accessToken}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(newComment),
      });
    } else {
      const newReply: AddCommentRequest = {
        postId: postId,
        parentCommentId: parentCommentId,
        comment: comment,
      };
      await fetch(`${process.env.NEXT_PUBLIC_POST_API_URL}/comment/reply`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${sessionState.accessToken}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(newReply),
      });
    }
    setLoading(false);
    // revalidate the cached comments
    revalidateCommentAction();
  }
  return (
    <Card className="m-1 p-1 shadow-lg dark:shadow-sm bg-secondary">
      <div className="flex flex-row items-center space-x-2">
        {profileData && (
          <PhotoViewer
            filename={profileData!.profilePicture.filename}
            rounded={true}
            radius="small"
          />
        )}
        <div className="flex flex-row grow justify-between">
          <Input
            type="text"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder={
              type === "comment" ? "Add a comment..." : "Add a reply ..."
            }
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onSubmit}
            disabled={loading}
          >
            <SendHorizonal />
          </Button>
        </div>
      </div>
    </Card>
  );
}
