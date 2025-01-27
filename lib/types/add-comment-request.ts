export interface AddCommentRequest {
  postId: string;
  parentCommentId?: string;
  comment: string;
}
