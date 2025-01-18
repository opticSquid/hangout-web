"use client";

import { GetPostsRequest } from "@/lib/types/get-posts-request";
import { GetPostResponse } from "@/lib/types/get-posts-response";
import { PostInterface } from "@/lib/types/post-interface";
import { useRef, useState, useEffect } from "react";
import { Post } from "./post";
import { PagePointer } from "@/lib/types/page-pointer";

export function PostFeed() {
  const location = useRef<GeolocationPosition | null>(null);
  const [locationPermissionDenied, setLocationPermissionDenied] =
    useState(false);
  const [postList, setPostList] = useState<PostInterface[]>([]);
  const [pagePointer, setPagePointer] = useState<PagePointer>({
    currentPage: 0,
    totalPages: 1,
  });
  const [searchRadius, setSearchRadius] = useState<number>(1500);
  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  // This useEffect hook gets user's location permission and fetches Posts
  useEffect(() => {
    // defining data fetching function
    async function fetchPosts(lat: number, lon: number): Promise<void> {
      const getPostsReqBody: GetPostsRequest = {
        lat: lat,
        lon: lon,
        searchRadius: searchRadius,
        pageNumber: pagePointer.currentPage + 1,
      };
      const response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_POST_API_URL}/post/near-me`,
        {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(getPostsReqBody),
        }
      );
      if (response.ok) {
        const data: GetPostResponse = await response.json();
        setPostList((prevState) => [...prevState, ...data.posts]);
        // if total count is undefined which it will be the page beign fetched is the first page maintain the previous value of totalPage
        setPagePointer((prevState: PagePointer) => {
          return {
            currentPage: prevState.currentPage + 1,
            totalPages: data.totalCount
              ? data.totalCount
              : prevState.totalPages,
          };
        });
      } else {
        console.error("could not fetch posts from backend");
      }
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          location.current = position;
          // fetch until all the posts have been shown
          if (pagePointer.currentPage <= pagePointer.totalPages) {
            fetchPosts(
              location.current.coords.latitude,
              location.current.coords.longitude
            );
          }
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationPermissionDenied(true);
          } else {
            console.error("Error getting location: ", error);
          }
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [locationPermissionDenied]);

  // This useEffect hook monitors which video is visible in viewport and plays and pauses for rest
  useEffect(() => {
    observer.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });
    const postElements = document.querySelectorAll(".post-container");
    postElements.forEach((el) => observer.current?.observe(el));

    //cleanup on unmount
    return () => {
      postElements.forEach((el) => observer.current?.unobserve(el));
    };
    function handleIntersection(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisiblePostId(entry.target.getAttribute("post-id"));
        } else {
          if (entry.target.getAttribute("post-id") === visiblePostId) {
            setVisiblePostId(null);
          }
        }
      });
    }
  }, [pagePointer.currentPage]);
  return (
    <div className="flex flex-col gap-2 snap-proximity snap-y">
      {postList.map((p: PostInterface) => (
        <div
          key={p.postId}
          post-id={p.postId}
          className="post-container snap-center"
        >
          <Post
            key={p.postId}
            post={p}
            canPlayVideo={p.postId === visiblePostId}
          />
        </div>
      ))}
    </div>
  );
}
