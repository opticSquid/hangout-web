import { NearbyPostInterface } from "./nearby-post-interface";

export interface GetPostResponse {
  posts: NearbyPostInterface[];
  totalPages?: number;
}
