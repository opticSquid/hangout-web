export interface AddCommentInterface {
  type: "comment" | "reply";
  postId: string;
  revalidateCommentAction: () => void;
  parentCommentId?: string;
}
