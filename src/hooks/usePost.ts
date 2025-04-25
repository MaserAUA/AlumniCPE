import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  CreatePostForm,
  ReportPostForm,
  UpdatePostParams,
} from "../models/post";
import api from "../configs/api";

// GET ALL POSTS
export const useGetAllPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await api.get("/post/all");
      return response.data;
    },
  });
};

// GET POST
export const useGetPostById = (post_id: string) => {
  return useQuery({
    queryKey: ["post", post_id],
    queryFn: async () => {
      const response = await api.get(`/post/${post_id}`);
      return response.data;
    },
  });
};

// CREATE POST
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createPostForm: CreatePostForm) => {
      const response = await api.post("/post", createPostForm);
      return response.data;
    },
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (old: any) => [
        ...(old || []),
        {
          ...newPost,
          post_id: Date.now().toString(),
          created_timestamp: new Date().toISOString(),
        },
      ]);

      return { previousPosts };
    },
    onError: (_err, _newPost, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// UPDATE POST
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatePostParams: UpdatePostParams) => {
      const response = await api.put(
        `/post/${updatePostParams.post_id}`,
        updatePostParams.post_info,
      );
      return response.data;
    },

    onMutate: async (updatePostParams) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData<any[]>(["posts"]);

      queryClient.setQueryData<any[]>(["posts"], (old) =>
        old?.map((post) =>
          post.id === updatePostParams.post_id
            ? { ...post, ...updatePostParams.post_info }
            : post,
        ),
      );
      // Save the previous single post data too
      const previousSinglePost = queryClient.getQueryData([
        "post",
        updatePostParams.post_id,
      ]);

      // Update it immediately
      queryClient.setQueryData(
        ["post", updatePostParams.post_id],
        (old: any) => ({
          ...old,
          ...updatePostParams.post_info,
        }),
      );

      return { previousPosts, previousSinglePost };
    },

    onError: (err, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      if (context?.previousSinglePost) {
        queryClient.setQueryData(
          ["post", _variables.post_id],
          context.previousSinglePost,
        );
      }
    },

    onSettled: (data, err, _variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", _variables.post_id] });
    },
  });
};

// DELETE POST
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post_id: string) => {
      const response = await api.delete(`/post/${post_id}`);
      return response.data;
    },
    onMutate: async (post_id) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", post_id] });

      const previousPosts = queryClient.getQueryData(["posts"]);
      const previousSinglePost = queryClient.getQueryData(["post", post_id]);

      queryClient.setQueryData(["posts"], (old: any) =>
        (old || []).filter((post: any) => post.id !== post_id),
      );

      queryClient.removeQueries({ queryKey: ["post", post_id] });

      return { previousPosts, previousSinglePost };
    },
    onError: (_err, post_id, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      if (context?.previousSinglePost) {
        queryClient.setQueryData(["post", post_id], context.previousSinglePost);
      }
    },
    onSettled: (_data, _error, post_id) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
