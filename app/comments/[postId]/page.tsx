import { AddComment } from "@/components/add-comment";
import { Comment } from "@/components/comment";
import { Post } from "@/components/post";
import type { CommentInterface } from "@/lib/types/comment-interface";
import { ParticularPostInterface } from "@/lib/types/particular-post-interface";
import { revalidateTag } from "next/cache";
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
      }`,
      {
        method: "GET",
        // used to invalidate the cache on new comment addition
        next: { tags: ["comments"] },
      }
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_POST_API_URL}/post/${(await params).postId}`,
      {
        method: "GET",
      }
    ),
  ]);
  const comments: CommentInterface[] = await commentResponse.json();
  const post: ParticularPostInterface = await postResponse.json();
  async function revalidateComments() {
    "use server";
    revalidateTag("comments");
  }
  return (
    <div className="flex flex-col gap-y-2 overflow-y-auto pb-14">
      <Post post={post} canPlayVideo={true} showDistance={false} />
      <AddComment
        postId={(await params).postId}
        // prop name should end with Action to receive server actions on client component
        revalidateCommentAction={revalidateComments}
      />
      {comments.map(async (comment: CommentInterface) => (
        <Comment
          comment={comment}
          postId={(await params).postId}
          key={comment.commentId}
        />
      ))}
    </div>
  );
}
