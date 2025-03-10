import { useCallback, useRef } from "react";
import { ApiResponse } from "../types/ApiResponse";
import { FetchPostsRequest } from "../types/fetch-posts-request";
import { FetchPostsResponse } from "../types/get-posts-response";
import { PagePointer } from "../types/page-pointer";
import { SearchRadius } from "../types/search-radius";

export default function useFeedUtils() {
  const searchRadius = useRef<SearchRadius>({ min: 0, max: 1000 });
  const pagePointer = useRef<PagePointer>({ currentPage: 1, totalPages: 0 });

  const increaseSearchRadius = () => {
    searchRadius.current = {
      min: searchRadius.current.max,
      max: searchRadius.current.max + 1000,
    };
  };

  const resetPagePointer = () => {
    pagePointer.current = { currentPage: 1, totalPages: 0 };
  };

  const fetchPosts = useCallback(
    async (
      location: GeolocationPosition
    ): Promise<ApiResponse<FetchPostsResponse>> => {
      const rqBody: FetchPostsRequest = {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        minSearchRadius: searchRadius.current.min,
        maxSearchRadius: searchRadius.current.max,
        pageNumber: pagePointer.current.currentPage,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_POST_API_URL}/post/near-me`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rqBody),
        }
      );

      if (!response.ok) {
        return {
          error: { message: "Could not fetch posts", status: response.status },
        };
      }

      const posts: FetchPostsResponse = await response.json();

      if (posts.totalPages !== undefined) {
        if (posts.totalPages <= 1) {
          increaseSearchRadius();
        } else {
          pagePointer.current = {
            currentPage: pagePointer.current.currentPage + 1,
            totalPages: posts.totalPages,
          };
        }
      } else if (
        pagePointer.current.currentPage === pagePointer.current.totalPages
      ) {
        increaseSearchRadius();
        resetPagePointer();
      } else {
        pagePointer.current.currentPage++;
      }

      return { data: posts };
    },
    []
  );

  return { fetchPosts };
}
