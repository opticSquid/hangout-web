export interface FetchPostsRequest {
  lat: number;
  lon: number;
  minSearchRadius: number;
  maxSearchRadius: number;
  pageNumber: number;
}
