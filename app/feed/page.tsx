"use client";
import { Post } from "@/components/post";
import useFeedUtils from "@/lib/hooks/feed-utils";
import { NearbyPostInterface } from "@/lib/types/nearby-post-interface";
import { useEffect, useState } from "react";

export default function PostFeed() {
  const { fetchPosts } = useFeedUtils();
  const [location, setLocation] = useState<GeolocationPosition | undefined>(
    undefined
  );
  const [postList, setPostList] = useState<NearbyPostInterface[]>([]);
  // Fetches user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
        },
        (error) => {
          if (error.PERMISSION_DENIED) {
            alert("Can not fetch near by posts with out location permission");
          } else if (error.POSITION_UNAVAILABLE) {
            alert(
              "Your location is not available at this moment. Please try again later"
            );
          } else {
            alert(
              "Something went wrong during fetching your location. Please refresh the page. If the error persists try agian later"
            );
          }
        }
      );
    }
  }, []);

  // Fetches data given user's location
  useEffect(() => {
    async function fetchData() {
      if (location != undefined) {
        for (let i = 0; i < 5; i++) {
          const response = await fetchPosts(location);
          if (response.data) {
            if (response.data.posts.length > 0) {
              setPostList((prevState) => {
                return [...prevState, ...(response.data?.posts || [])];
              });
              break;
            }
          } else {
            console.error("error fetchig posts");
            break;
          }
        }
      }
    }
    fetchData();
  }, [location]);

  useEffect(() => {
    console.log("postList: ", postList);
  }, [postList]);

  return (
    <div className="flex flex-col gap-y-4 snap-mandatory snap-y pb-12">
      {postList.length > 0 &&
        postList.map((post) => (
          <div
            key={post.postId}
            post-id={post.postId}
            className="post-container snap-always snap-start"
          >
            <Post post={post} canPlayVideo={false} showDistance={true} />
          </div>
        ))}
    </div>
  );
}
