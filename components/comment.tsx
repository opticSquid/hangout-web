import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTimeDifferenceFromUTC } from "@/lib/time-difference";
import { CommentInterface } from "@/lib/types/comment-interface";
import { ProfileData } from "@/lib/types/get-profile-response";
import { Dot, MessageSquareReply } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { PhotoViewer } from "./photo-viewer";

export async function Comment({
  comment,
  postId,
}: {
  comment: CommentInterface;
  postId: string;
}) {
  const profileResponse: Response = await fetch(
    `${process.env.NEXT_PUBLIC_PROFILE_API_URL}/profile/${comment.userId}`,
    {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    }
  );
  const profileData: ProfileData = await profileResponse.json();

  return (
    <>
      <div className="m-1 flex flex-row items-start gap-2 pl-2 pr-2">
        <PhotoViewer
          filename={profileData.profilePicture.filename}
          rounded={true}
          radius="small"
        />
        <div className="flex flex-col">
          <div className="flex flex-row items-center text-base text-neutral-400 dark:text-neutral-500 font-semibold tracking-tighter">
            <div>{profileData.name}</div>
            <Dot size={16} />
            <div>{getTimeDifferenceFromUTC(comment.createdAt)}</div>
          </div>
          <div className="text-lg">{comment.text}</div>
          <div className="flex flex-row items-center">
            <Link href={`/comments/${postId}/reply/${comment.commentId}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 dark:text-gray-300 pl-1"
              >
                <MessageSquareReply size={18} />
                &nbsp;reply
              </Button>
            </Link>
            {comment.replyCount > 0 && (
              <div className="text-primaryButton">
                {comment.replyCount}&nbsp;
                {comment.replyCount > 1 ? "replies" : "reply"}
              </div>
            )}
          </div>
        </div>
      </div>
      <hr className="ml-2 mr-2 bg-gray-400 dark:bg-slate-800" />
    </>
  );
}
