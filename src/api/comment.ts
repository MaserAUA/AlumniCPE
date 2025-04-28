import {
  CommentOnPostForm,
  EditCommentForm,
  LikeCommentPost,
  RemoveCommentForm,
  RemoveLikeCommentPost,
  ReplyCommentOnPostForm,
} from "../models/post";
import api from "../configs/api";

export const getPostComments = async (post_id: string) => {
  const response = await api.get(`/post/${post_id}/comment`);
  return response.data.data;
};

// COMMENT ON A POST
export const commentPost = async (payload: CommentOnPostForm) => {
  const { data } = await api.post(`/post/${payload.post_id}/comment`, {
    comment: payload.content,
  });
  return data.data;
};

// REPLY TO A COMMENT
export const replyCommentPost = async (payload: ReplyCommentOnPostForm) => {
  const { data } = await api.post(
    `/post/${payload.post_id}/comment/${payload.comment_id}`,
    { comment: payload.content },
  );
  return data.data; // assumes full reply comment object
};

// EDIT COMMENT
export const editCommentPost = async (payload: EditCommentForm) => {
  const { data } = await api.put(
    `/post/${payload.post_id}/comment/${payload.comment_id}`,
    { comment: payload.content },
  );
  return data.data;
};

// DELETE COMMENT
export const removeCommentPost = async (payload: RemoveCommentForm) => {
  const { data } = await api.delete(
    `/post/${payload.post_id}/comment/${payload.comment_id}`,
  );
  return data.data;
};

// LIKE COMMENT
export const likeCommentPost = async (payload: LikeCommentPost) => {
  const { data } = await api.post(`/post/comment/${payload.comment_id}/like`);
  return data.data;
};

// REMOVE LIKE FROM COMMENT
export const removeLikeCommentPost = async (payload: RemoveLikeCommentPost) => {
  const { data } = await api.delete(`/post/comment/${payload.comment_id}/like`);
  return data.data;
};
