import { Comment } from "@/components/comment";
import { Post } from "@/components/post";
import type { CommentInterface } from "@/lib/types/comment-interface";
import { PostInterface } from "@/lib/types/post-interface";

export default async function Comments({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const [commentResponse, postResponse]: Response[] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_POST_API_URL}/comment/all/${
        (
          await params
        ).postId
      }`
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_POST_API_URL}/post/${(await params).postId}`
    ),
  ]);
  const comments: CommentInterface[] = await commentResponse.json();
  const post: PostInterface = await postResponse.json();
  return (
    <div className="flex flex-col gap-2 overflow-y-auto">
      <Post post={post} canPlayVideo={true} />
      {comments.map((comment: CommentInterface) => (
        <Comment {...comment} key={comment.commentId} />
      ))}
    </div>
  );
}
