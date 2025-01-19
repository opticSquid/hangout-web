export interface GetPostsRequest {
  lat: number;
  lon: number;
  minSearchRadius: number;
  maxSearchRadius: number;
  pageNumber: number;
}
