"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizonal } from "lucide-react";
import { useSessionStore } from "@/lib/hooks/session-provider";
import { AddCommentRequest } from "@/lib/types/add-comment-request";
import { Comment } from "./comment";
import { revalidateTag } from "next/cache";

export function AddComment({
  postId,
  revalidateCommentAction,
}: {
  postId: string;
  revalidateCommentAction: () => void;
}) {
  const { accessToken } = useSessionStore((state) => state);
  const [comment, setComment] = useState("");
  const [showNewComment, setShowNewComment] = useState(false);
  //TODO: add fuction here
  function onSubmit() {
    const newComment: AddCommentRequest = { postId: postId, comment: comment };
    fetch(`${process.env.NEXT_PUBLIC_POST_API_URL}/comment`, {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(newComment),
    });
    // revalidate the cached comments
    revalidateCommentAction();
    setShowNewComment(true);
  }
  return (
    <>
      <Card className="m-1 p-1 shadow-lg dark:shadow-sm bg-secondary">
        <div className="flex flex-row items-center space-x-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback delayMs={500}>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-row grow justify-between">
            <Input
              type="text"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Add a comment..."
            />
            <Button variant="ghost" size="icon" onClick={onSubmit}>
              <SendHorizonal />
            </Button>
          </div>
        </div>
      </Card>
      {showNewComment && (
        <Comment
          commentId="new"
          createdAt={new Date().toISOString()}
          text={comment}
          userId={0}
        />
      )}
    </>
  );
}
