import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "./ui/button";

export function PostInteractions() {
  return (
    <div className="flex flex-row">
      <Button variant="ghost" size="icon">
        <Heart />
      </Button>
      <Button variant="ghost" size="icon">
        <MessageCircle />
      </Button>
      <div className="grow" />
      <Button variant="ghost" size="icon">
        <Share2 />
      </Button>
    </div>
  );
}
