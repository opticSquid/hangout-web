"use client";
import { Post } from "@/components/post";
import { useServiceWorkerStore } from "@/lib/hooks/service-worker-provider";
import { GetPostResponse } from "@/lib/types/get-posts-response";
import { PagePointer } from "@/lib/types/page-pointer";
import { PostInterface } from "@/lib/types/post-interface";
import { SearchRadius } from "@/lib/types/search-radius";
import { useEffect, useMemo, useState } from "react";
export default function PostFeed() {
  const [locationPermissionDenied, setLocationPermissionDenied] =
    useState(false);
  const { worker } = useServiceWorkerStore((state) => state);
  const [postList, setPostList] = useState<Map<string, PostInterface>>(
    new Map()
  );
  const [pagePointer, setPagePointer] = useState<PagePointer>({
    currentPage: 0,
    totalPages: 0,
  });
  const [searchRadius, setSearchRadius] = useState<SearchRadius>({
    min: 0,
    max: 1000,
  });
  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);
  const postToTriggerDataLoad = useMemo(() => {
    console.log("75% th element: ", Math.floor(postList.size * 0.75));
    return Math.floor(postList.size * 0.75);
  }, [postList]);
  const [triggerDataLoad, setTriggerDataLoad] = useState(false);

  //this function adds to postListMap
  function appendPostList(newPosts: PostInterface[]) {
    setPostList((prevState: Map<string, PostInterface>) => {
      const updatedList = new Map(prevState);
      newPosts.forEach((post: PostInterface) => {
        if (!updatedList.has(post.postId)) {
          updatedList.set(post.postId, post);
        }
      });
      return updatedList;
    });
  }
  // This function communicates with the service worker to fetch post
  function fetchPosts(position: GeolocationPosition) {
    worker?.active?.postMessage({
      type: "fetch-posts-request",
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      min: searchRadius.min,
      max: searchRadius.max,
      pageNumber: pagePointer.currentPage + 1,
      backendUrl: process.env.NEXT_PUBLIC_POST_API_URL,
    });
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data.type === "fetch-posts-response") {
        const data: GetPostResponse = event.data.response;
        console.log("appending posts to list");
        appendPostList(data.posts);
        // if total count is undefined which it will be the page beign fetched is the first page maintain the previous value of totalPage
        console.log("updating page pointer");
        setPagePointer((prevState: PagePointer) => {
          return {
            currentPage: prevState.currentPage + 1,
            totalPages:
              data.totalPages != undefined
                ? data.totalPages
                : prevState.totalPages,
          };
        });
      }
    });
  }
  // This useEffect hook gets user's location permission and does initial load of Posts
  useEffect(() => {
    if (navigator.geolocation && "serviceWorker" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchPosts(position);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationPermissionDenied(true);
          } else {
            console.error(
              "Error getting location or service-worker is not supported: ",
              error
            );
          }
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [locationPermissionDenied, worker]);

  // This useEffect hook monitors which video is visible in viewport and plays and pauses the video playback for rest of the posts
  useEffect(() => {
    const videoPlayObserver = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });
    const postElements = document.querySelectorAll(".post-container");
    postElements.forEach((el) => videoPlayObserver.observe(el));

    //cleanup on unmount
    return () => {
      postElements.forEach((el) => videoPlayObserver.unobserve(el));
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

  // This useEffect observes 75%th element in the list. if that element is visible it triggers more data load in backfround
  useEffect(() => {
    console.log("triggered 75% observer");
    const postElements = document.querySelectorAll(".post-container");
    if (postElements.length > 0 && postList.size > 0) {
      console.log(
        "posts are non empty, post elements: ",
        postElements.length,
        " post list: ",
        postList.size
      );
      const triggerIndexElement = postElements[postToTriggerDataLoad];
      console.log("trigger element: ", triggerIndexElement);
      const triggerIndexObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTriggerDataLoad(true);
          }
        },
        { threshold: 0.5 }
      );
      if (triggerIndexElement) {
        triggerIndexObserver.observe(triggerIndexElement);
      }
      // cleanup on unmount
      return () => {
        triggerIndexObserver.unobserve(triggerIndexElement);
      };
    }
  }, [locationPermissionDenied, postToTriggerDataLoad]);

  // This post loads more data in background
  useEffect(() => {
    if (triggerDataLoad) {
      console.log("75% of the list is viewed, triggering more data load");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("current page pointer: ", pagePointer);
          if (pagePointer.currentPage < pagePointer.totalPages) {
            console.log("more posts remaining in current search radius");
            fetchPosts(position);
          } else {
            console.log("increasing search radius");
            setPagePointer({ currentPage: 0, totalPages: 0 });
            setSearchRadius((prevState: SearchRadius) => {
              return { min: prevState.max, max: prevState.max + 1000 };
            });
            fetchPosts(position);
          }
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationPermissionDenied(true);
          } else {
            console.error(
              "Error getting location or service-worker is not supported: ",
              error
            );
          }
        }
      );
      setTriggerDataLoad(false);
    }
  }, [triggerDataLoad]);

  useEffect(() => {
    console.log("current post list size: ", postList.size);
  }, [postList]);
  useEffect(() => {
    console.log("curent page pointer: ", pagePointer);
  }, [pagePointer]);
  return (
    <div className="flex flex-col gap-2 snap-mandatory snap-y">
      {Array.from(postList.values()).map((p: PostInterface) => (
        <div
          key={p.postId}
          post-id={p.postId}
          className="post-container snap-always snap-start"
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
