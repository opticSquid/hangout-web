"use client";
import useStore from "@/lib/hooks/use-store";
import { useNewSessionStore } from "@/lib/stores/session-store";
import { HasHearted } from "@/lib/types/has-hearted";
import { PostInteraction } from "@/lib/types/post-interaction-interface";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function PostInteractions(postInteraction: PostInteraction) {
  const store = useStore(useNewSessionStore, (state) => state);
  const router = usePathname();
  const activeButtonStyle: string =
    "bg-primaryContainer text-onPrimaryContainer rounded-full";
  const idleButtonStyle: string = "bg-transparent text-primary rounded-full";
  const [isHearted, setIsHearted] = useState(false);
  const [heartCount, setHeartCount] = useState(postInteraction.heartCount);
  useEffect(() => {
    async function fetchData() {
      if (store?.accessToken) {
        const isLovedResponse: Response = await fetch(
          `${process.env.NEXT_PUBLIC_POST_API_URL}/heart/${postInteraction.postId}`,
          {
            method: "GET",
            headers: new Headers({
              Authorization: `Bearer ${store?.accessToken}`,
            }),
          }
        );
        const hasHearted: HasHearted = await isLovedResponse.json();
        setIsHearted(hasHearted.hasHearted);
      }
    }
    fetchData();
  }, [store?.accessToken, postInteraction.postId]);
  const toggleIsLoved = async (): Promise<void> => {
    if (isHearted === false) {
      fetch(`${process.env.NEXT_PUBLIC_POST_API_URL}/heart`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${store?.accessToken}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ postId: postInteraction.postId }),
      });
      setHeartCount((prevState) => prevState + 1);
    } else {
      fetch(`${process.env.NEXT_PUBLIC_POST_API_URL}/heart`, {
        method: "DELETE",
        headers: new Headers({
          Authorization: `Bearer ${store?.accessToken}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ postId: postInteraction.postId }),
      });
      setHeartCount((prevState) => prevState - 1);
    }
    setIsHearted(!isHearted);
  };
  return (
    <div className="flex flex-row items-center">
      <Button
        key={isHearted ? 1 : 0}
        variant="ghost"
        size="icon"
        className={isHearted ? activeButtonStyle : idleButtonStyle}
        disabled={!store?.accessToken}
        onClick={toggleIsLoved}
      >
        <Heart />
      </Button>
      <div>{heartCount}</div>
      <div className="basis-3" />
      {router.startsWith("/comments/") ? (
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
      <div>{postInteraction.commentCount}</div>
      <div className="grow" />
      <Button variant="ghost" size="icon">
        <Share2 />
      </Button>
    </div>
  );
}
