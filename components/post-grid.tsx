"use client";

import useSessionProvider from "@/lib/hooks/session-provider";
import { ParticularPostInterface } from "@/lib/types/particular-post-interface";
import { useEffect, useState } from "react";
import { Post } from "./post";

export function PostGrid() {
  const [sessionState] = useSessionProvider();
  const [postList, setPostList] = useState<
    ParticularPostInterface[] | undefined
  >(undefined);
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
  return postList?.map((post) => (
    <Post
      post={post}
      canPlayVideo={true}
      showDistance={false}
      key={post.postId}
    />
  ));
}
