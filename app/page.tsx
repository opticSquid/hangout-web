"use client";
import { Post } from "@/components/post";
import { useServiceWorkerStore } from "@/lib/hooks/service-worker-provider";
import { FetchPostsResponse } from "@/lib/types/get-posts-response";
import { NearbyPostInterface } from "@/lib/types/nearby-post-interface";
import { PagePointer } from "@/lib/types/page-pointer";
import { SearchRadius } from "@/lib/types/search-radius";
import { useEffect, useMemo, useRef, useState } from "react";

export default function PostFeed() {
  const locationPermissionDenied = useRef<boolean>(false);
  const [location, setLocation] = useState<GeolocationPosition>();
  const { worker } = useServiceWorkerStore((state) => state);
  const [postList, setPostList] = useState<Map<string, NearbyPostInterface>>(
    new Map()
  );
  const pagePointer = useRef<PagePointer>({
    currentPage: 0,
    totalPages: undefined,
  });
  const searchRadius = useRef<SearchRadius>({
    min: 0,
    max: 1000,
  });
  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);
  /**
   * Calculates the 75% th element of the list. When that elment becomes visible it triggers additional data load
   */
  const postToTriggerDataLoad = useMemo(
    () => Math.floor(postList.size * 0.75),
    [postList]
  );
  const [triggerDataLoad, setTriggerDataLoad] = useState<boolean>(false);

  /**
   * Updates the post list with new posts while avoiding duplicates.
   */
  const appendPostList = (newPosts: NearbyPostInterface[]) => {
    setPostList((prevState) => {
      const updatedMap = new Map(prevState);
      newPosts.forEach((post) => {
        if (!updatedMap.has(post.postId)) {
          updatedMap.set(post.postId, post);
        }
      });
      return updatedMap;
    });
  };

  /**
   * Fetches posts via the service worker and appends them to the post list.
   */
  const fetchAndAppendPosts = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (worker && location) {
        worker.active?.postMessage({
          type: "fetch-posts-request",
          lat: location.coords.latitude,
          lon: location.coords.longitude,
          min: searchRadius.current.min,
          max: searchRadius.current.max,
          pageNumber: pagePointer.current.currentPage,
          backendUrl: process.env.NEXT_PUBLIC_POST_API_URL as string,
        });

        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === "fetch-posts-response") {
            navigator.serviceWorker.removeEventListener(
              "message",
              handleMessage
            );

            const response = event.data.response as FetchPostsResponse | null;

            if (response && response.posts.length > 0) {
              appendPostList(response.posts);
              pagePointer.current.totalPages = response.totalPages ?? undefined;
              resolve(true);
            } else {
              resolve(false);
            }
          }
        };

        navigator.serviceWorker.addEventListener("message", handleMessage);
      } else {
        reject(new Error("Location or worker is not defined"));
      }
    });
  };

  /**
   * Retries fetching posts with an increasing search radius.
   */
  const attemptFetchWithRadiusIncrease = async (
    maxRetries: number
  ): Promise<boolean> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      console.log(
        `attempt:${attempt} to call fetch and append posts. will wait promise resolution. time: ${new Date().toISOString()}`
      );
      const success = await fetchAndAppendPosts();
      console.log(
        `attempt:${attempt} to call fetch and append posts. Promise resolved to ${success}. time: ${new Date().toISOString()}`
      );
      if (success) return true;

      searchRadius.current = {
        min: searchRadius.current.max,
        max: searchRadius.current.max + 1000,
      };
    }
    return false;
  };

  /**
   * Resets the page pointer to the initial state.
   */
  const resetPagePointer = (): void => {
    pagePointer.current = { currentPage: 1, totalPages: undefined };
  };

  /**
   * When service worker registers fetches the location and triggers intial data load by setting triggerDataLoad to true
   */
  useEffect(() => {
    if (navigator.geolocation && "serviceWorker" in navigator && worker) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(
            `worker and location defined triggering initial data load. time: ${new Date().toISOString()}`
          );
          setLocation(position);
          setTriggerDataLoad(true);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            locationPermissionDenied.current = true;
          }
        }
      );
    }
  }, [worker]);

  /**
   * When trigger data load is true triggers additionaln data load
   */
  useEffect(() => {
    /**
     * Handles the initial data load or radius-based retries.
     */
    const loadInitialData = async () => {
      if (!triggerDataLoad || !location) {
        setTriggerDataLoad(false);
        return;
      }
      console.log(`trigger data load has been set to true. loading data. 
      time: ${new Date().toISOString()}`);
      if (!pagePointer.current.totalPages) {
        console.log(
          `total pages is undefined triggering initial data load. time: ${new Date().toISOString()}`
        );
        pagePointer.current.currentPage += 1;
        await attemptFetchWithRadiusIncrease(5);
      } else if (
        pagePointer.current.currentPage < pagePointer.current.totalPages
      ) {
        console.log(
          `triggering data load of next page with same search radius. time: ${new Date().toISOString()}`
        );
        pagePointer.current.currentPage += 1;
        const success = await fetchAndAppendPosts();
        if (!success) pagePointer.current.currentPage -= 1;
      } else {
        console.log(
          `current Page ${pagePointer.current.currentPage} >= total Pages ${
            pagePointer.current.totalPages
          }. Resetting page pointer and searching for larger search radius. time: ${new Date().toISOString()}`
        );
        resetPagePointer();
        // initially increasing the search radius here so that the first request attempt only goes for larger search radius
        searchRadius.current = {
          min: searchRadius.current.max,
          max: searchRadius.current.max + 1000,
        };
        await attemptFetchWithRadiusIncrease(5);
      }

      setTriggerDataLoad(false);
    };
    loadInitialData();
  }, [triggerDataLoad]);

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

  /**
   * Watches the 75% th element of the list. when that is visible, starts to load additional posts in background
   */
  useEffect(() => {
    console.log(
      `post list changed, reobserving 75% th element. time: ${new Date().toISOString()}`
    );
    const postElements = document.querySelectorAll(".post-container");
    if (postElements.length > 0) {
      const triggerElement = postElements[postToTriggerDataLoad];
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            console.log(
              `75% th element i.e., ${postToTriggerDataLoad}th element is visible triggering additional data load. time: ${new Date().toISOString()}`
            );
            setTriggerDataLoad(true);
          }
        },
        { threshold: 0.5 }
      );

      if (triggerElement) observer.observe(triggerElement);
      return () => observer.unobserve(triggerElement);
    }
  }, [postToTriggerDataLoad, postList]);

  return (
    <div className="flex flex-col gap-y-4 snap-mandatory snap-y pb-12">
      {Array.from(postList.values()).map((p) => (
        <div
          key={p.postId}
          post-id={p.postId}
          className="post-container snap-always snap-start"
        >
          <Post
            post={p}
            canPlayVideo={p.postId === visiblePostId}
            showDistance={true}
          />
        </div>
      ))}
    </div>
  );
}
