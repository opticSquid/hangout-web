import type { Post } from "@/types/post-interface";
import { Card } from "./ui/card";

export function Post(post: Post) {
  return (
    <Card>
      <div>{post?.postContent}</div>
    </Card>
  );
}
