import {
  CommentOnPostForm,
  EditCommentForm,
  LikeCommentPost,
  RemoveCommentForm,
  RemoveLikeCommentPost,
  ReplyCommentOnPostForm,
} from "../models/post";
import api from "../configs/api";
import { axiosRequest } from "../utils/requestWrapper";

export const getPostComments = async (post_id: string) => {
  return axiosRequest(() => api.get(`/post/${post_id}/comment`));
};

// COMMENT ON A POST
export const commentPost = async (payload: CommentOnPostForm) => {
  return axiosRequest(() =>
    api.post(`/post/${payload.post_id}/comment`, { comment: payload.content }),
  );
};

// REPLY TO A COMMENT
export const replyCommentPost = async (payload: ReplyCommentOnPostForm) => {
  return axiosRequest(() =>
    api.post(`/post/${payload.post_id}/comment/${payload.comment_id}`, {
      comment: payload.content,
    }),
  );
};

// EDIT COMMENT
export const editCommentPost = async (payload: EditCommentForm) => {
  return axiosRequest(() =>
    api.put(`/post/${payload.post_id}/comment/${payload.comment_id}`, {
      comment: payload.content,
    }),
  );
};

// DELETE COMMENT
export const removeCommentPost = async (payload: RemoveCommentForm) => {
  return axiosRequest(() =>
    api.delete(`/post/${payload.post_id}/comment/${payload.comment_id}`),
  );
};

// LIKE COMMENT
export const likeCommentPost = async (payload: LikeCommentPost) => {
  return axiosRequest(() =>
    api.post(`/post/comment/${payload.comment_id}/like`),
  );
};

// REMOVE LIKE FROM COMMENT
export const removeLikeCommentPost = async (payload: RemoveLikeCommentPost) => {
  return axiosRequest(() =>
    api.delete(`/post/comment/${payload.comment_id}/like`),
  );
};
