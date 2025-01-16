export interface PostObject {
  postId: string;
  ownerId: number;
  filename: string;
  contentType: string;
  postDescription?: string;
  hearts: number;
  comments: number;
  interactions: number;
  createdAt: string;
  location: location;
  distance: number;
}

interface location {
  type: string;
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  coordinates: number[];
}
