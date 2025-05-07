import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  CreatePostForm,
  ReportPostForm,
  UpdatePostParams,
} from "../models/post";
import { Post, FormattedPost } from "../models/postType";
import { v4 as uuid4 } from "uuid";
import api from "../configs/api";
import { useMemo } from "react";
import moment from "moment";
import { redirect } from "react-router-dom";
import { axiosRequest } from "../utils/requestWrapper";

export const getAllPosts = async () => {
  return axiosRequest(() => api.get("/post/all"));
};

export const getPostById = async (post_id: string) => {
  return axiosRequest(() => api.get(`/post/${post_id}`));
};

export const createPost = async (payload: CreatePostForm) => {
  return axiosRequest(() => api.post("/post", payload));
};

export const updatePost = async (payload: UpdatePostParams) => {
  const post_info = {
    title: payload.title,
    content: payload.content,
    post_type: payload.post_type,
    start_date: payload.start_date,
    end_date: payload.end_date,
    media_urls: payload.media_urls,
    redirect_link: payload.redirect_link,
    visibility: payload.visibility,
  };
  return axiosRequest(() => api.put(`/post/${payload.post_id}`, post_info));
};

export const deletePost = async (post_id: string) => {
  return axiosRequest(() => api.delete(`/post/${post_id}`));
};

export const likePost = async (post_id: string) => {
  return axiosRequest(() => api.post(`/post/${post_id}/like`));
};

export const removeLikePost = async (post_id: string) => {
  return axiosRequest(() => api.delete(`/post/${post_id}/like`));
};
