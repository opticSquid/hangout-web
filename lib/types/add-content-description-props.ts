import { MediaType } from "./accepted-media-type";

export interface AddContentDescriptionProps {
  blob: Blob;
  mediaType: MediaType;
  onRetake: () => void;
  onAddDescription: (description: string) => void;
}
