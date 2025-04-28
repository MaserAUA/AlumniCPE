import { Comment } from "../models/commentType";

export const countComments = (comments: Comment[]): number => {
  let total = 0;
  for (const comment of comments) {
    total += 1;
    if (comment.replies && comment.replies.length > 0) {
      total += countComments(comment.replies);
    }
  }
  return total;
};
