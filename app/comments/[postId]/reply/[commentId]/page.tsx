import { AddComment } from "@/components/add-comment";
import { Comment } from "@/components/comment";
import { Post } from "@/components/post";
import { CommentInterface } from "@/lib/types/comment-interface";
import { ParticularPostInterface } from "@/lib/types/particular-post-interface";
import { revalidateTag } from "next/cache";

export default async function Replies({
  params,
}: {
  params: Promise<{ postId: string; commentId: string }>;
}) {
  const [commentResponse, replyResponse, postResponse]: Response[] =
    await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_POST_API_URL}/comment/${
          (
            await params
          ).commentId
        }`,
        {
          method: "GET",
          next: { tags: ["comment"] },
          cache: "no-cache",
        }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_POST_API_URL}/comment/${
          (
            await params
          ).commentId
        }/replies`,
        { method: "GET", next: { tags: ["replies"] }, cache: "no-cache" }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_POST_API_URL}/post/${(await params).postId}`,
        {
          method: "GET",
          next: { tags: ["post"] },
          cache: "no-cache",
        }
      ),
    ]);
  const comment: CommentInterface = await commentResponse.json();
  const replies: CommentInterface[] = await replyResponse.json();
  const post: ParticularPostInterface = await postResponse.json();
  async function revalidateReplies() {
    "use server";
    revalidateTag("replies");
  }
  return (
    <div className="flex flex-col gap-y-2 overflow-y-auto pb-14">
      <Post post={post} canPlayVideo={true} showDistance={false} />
      <Comment comment={comment} postId={(await params).postId} />
      <AddComment
        type="reply"
        postId={(await params).postId}
        // prop name should end with Action to receive server actions on client component
        revalidateCommentAction={revalidateReplies}
        parentCommentId={(await params).commentId}
      />
      {replies.map(async (reply: CommentInterface) => (
        <Comment
          comment={reply}
          postId={(await params).postId}
          key={reply.commentId}
        />
      ))}
    </div>
  );
}
