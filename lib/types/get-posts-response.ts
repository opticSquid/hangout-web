import { PostInterface } from "./post-interface";

export interface GetPostResponse {
  posts: PostInterface[];
  totalCount?: number;
}
