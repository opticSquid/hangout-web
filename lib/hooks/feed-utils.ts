import { useCallback, useRef, useState } from "react";
import { ApiResponse } from "../types/ApiResponse";
import { FetchPostsRequest } from "../types/fetch-posts-request";
import { FetchPostsResponse } from "../types/get-posts-response";
import { SearchRadius } from "../types/search-radius";
import { PagePointer } from "../types/page-pointer";

export default function useFeedUtils() {
  const searchRadius = useRef<SearchRadius>({
    min: 0,
    max: 1000,
  });
  const [pagePointer, setPagePointer] = useState<PagePointer>({
    currentPage: 1,
    totalPages: undefined,
  });
  const fetchPosts = useCallback(
    async (
      location: GeolocationPosition
    ): Promise<ApiResponse<FetchPostsResponse>> => {
      const rqBody: FetchPostsRequest = {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        minSearchRadius: searchRadius.current.min,
        maxSearchRadius: searchRadius.current.max,
        pageNumber: pagePointer.currentPage,
      };
      const response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_POST_API_URL}/post/near-me`,
        {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(rqBody),
        }
      );
      if (!response.ok) {
        return {
          error: { message: "could not fetch posts", status: response.status },
        };
      }
      const posts: FetchPostsResponse = await response.json();
      if (pagePointer.currentPage === pagePointer.totalPages) {
        searchRadius.current = {
          min: searchRadius.current.max,
          max: searchRadius.current.max + 1000,
        };
        setPagePointer({ currentPage: 1, totalPages: undefined });
      } else {
        setPagePointer((prevState) => {
          return {
            ...prevState,
            currentPage: prevState.currentPage + 1,
            totalPages:
              prevState.currentPage === 1
                ? posts.totalPages
                : prevState.totalPages,
          };
        });
      }
      return { data: posts };
    },
    []
  );
  return {
    fetchPosts,
  };
}
