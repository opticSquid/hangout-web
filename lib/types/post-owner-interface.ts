import { Location } from "./location";

export interface PostOwner {
  name: string;
  photo: string;
  category?: string;
  state: string;
  city: string;
  distance: number;
  location: Location;
}
