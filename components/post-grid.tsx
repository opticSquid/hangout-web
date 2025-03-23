"use client";

import { useSessionContext } from "@/lib/hooks/session-provider";
import { ParticularPostInterface } from "@/lib/types/particular-post-interface";
import { useEffect, useMemo, useState } from "react";
import { Post } from "./post";
import { EmptyFeed } from "./empty-feed";

export function PostGrid() {
  const [sessionState] = useSessionContext();
  const [postList, setPostList] = useState<ParticularPostInterface[]>([]);
  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      const response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_POST_API_URL}/post/my-posts`,
        {
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${sessionState.accessToken}`,
          }),
        }
      );
      if (response.status === 200) {
        const postList: ParticularPostInterface[] = await response.json();
        setPostList(postList);
      }
    }
    fetchPosts();
  }, [sessionState.accessToken]);

  /**
   * Calculates the 75% th element of the list. When that elment becomes visible it triggers additional data load
   */
  const postToTriggerDataLoad = useMemo(
    () => Math.floor(postList.length * 0.75),
    [postList]
  );

  /**
   * autoplays the currently visible video and pauses others
   */
  useEffect(() => {
    const postElements = document.querySelectorAll(".post-container");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisiblePostId(entry.target.getAttribute("post-id"));
          }
        });
      },
      { threshold: 0.5 }
    );

    postElements.forEach((el) => observer.observe(el));
    return () => postElements.forEach((el) => observer.unobserve(el));
  }, [postToTriggerDataLoad]);

  return postList ? (
    postList?.map((post) => (
      <div className="post-container" key={post.postId}>
        <Post post={post} canPlayVideo={true} showDistance={false} />
      </div>
    ))
  ) : (
    <EmptyFeed />
  );
}
