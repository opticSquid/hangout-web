import { Location } from "./location";

export interface NearbyPostInterface {
  postId: string;
  ownerId: number;
  filename: string;
  contentType: string;
  postDescription?: string;
  hearts: number;
  comments: number;
  interactions: number;
  createdAt: string;
  state: string;
  city: string;
  location: Location;
  distance: number;
}
