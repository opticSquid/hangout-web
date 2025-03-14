"use client";

import useStore from "@/lib/hooks/use-store";
import { useNewSessionStore } from "@/lib/stores/session-store";
import { AddCommentRequest } from "@/lib/types/add-comment-request";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

export function AddComment({
  postId,
  revalidateCommentAction,
  parentCommentId,
}: {
  postId: string;
  revalidateCommentAction: () => void;
  parentCommentId?: string;
}) {
  const store = useStore(useNewSessionStore, (state) => state);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
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
          Authorization: `Bearer ${store?.accessToken}`,
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
          Authorization: `Bearer ${store?.accessToken}`,
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
