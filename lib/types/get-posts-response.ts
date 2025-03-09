import { NearbyPostInterface } from "./nearby-post-interface";

export interface FetchPostsResponse {
  posts: NearbyPostInterface[];
  totalPages?: number;
}
