export interface AddContentDescriptionProps {
  blob: Blob;
  mediaType: "image/jpeg" | "video/webm";
  onRetake: () => void;
  onAddDescription: (description: string) => void;
}
