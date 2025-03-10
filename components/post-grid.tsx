"use client";

import useStore from "@/lib/hooks/use-store";
import { useNewSessionStore } from "@/lib/stores/session-store";
import { ParticularPostInterface } from "@/lib/types/particular-post-interface";
import { useEffect, useState } from "react";
import { Post } from "./post";

export function PostGrid() {
  const store = useStore(useNewSessionStore, (state) => state);
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
            Authorization: `Bearer ${store?.accessToken}`,
          }),
        }
      );
      if (response.status === 200) {
        const postList: ParticularPostInterface[] = await response.json();
        setPostList(postList);
      }
    }
    fetchPosts();
  }, [store?.accessToken]);
  return postList?.map((post) => (
    <Post
      post={post}
      canPlayVideo={true}
      showDistance={false}
      key={post.postId}
    />
  ));
}
