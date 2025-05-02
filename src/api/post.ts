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

export const getAllPosts = async () => {
  const { data } = await api.get("/post/all");
  return data.data;
};

export const getPostById = async (post_id: string) => {
  const { data } = await api.get(`/post/${post_id}`);
  return data.data;
};

export const createPost = async (payload: CreatePostForm) => {
  const { data } = await api.post("/post", payload);
  return data.data;
};

export const updatePost = async (payload: UpdatePostParams) => {
  const post_info = {
    title: payload.title,
    content: payload.content,
    post_type: payload.post_type,
    start_date: payload.start_date,
    end_date: payload.end_date,
    media_urls: payload.media_urls,
    visibility: payload.visibility,
  };
  const { data } = await api.put(`/post/${payload.post_id}`, post_info);
  return data.data;
};

export const deletePost = async (post_id: string) => {
  const { data } = await api.delete(`/post/${post_id}`);
  return data.data;
};

export const likePost = async (post_id: string) => {
  const { data } = await api.post(`/post/${post_id}/like`);
  return data.data;
};

export const removeLikePost = async (post_id: string) => {
  const { data } = await api.delete(`/post/${post_id}/like`);
  return data.data;
};
