export interface PostInterface {
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

export interface Location {
  type: string;
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  coordinates: number[];
}
