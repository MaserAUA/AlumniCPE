import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  CreatePostForm,
  ReportPostForm,
  UpdatePostParams,
} from "../models/post";
import { v4 as uuid4 } from "uuid";
import api from "../configs/api";
import { useMemo } from "react";

// GET ALL POSTS
export const useGetAllPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await api.get("/post/all");
      return response.data.data;
    },
  });
};

export const useRecentEvents = () => {
  const { data, ...rest } = useGetAllPosts();

  const recentEvents = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const formatDate = (date: Date) =>
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

    return data
      .filter((post) => post.post_type === "event")
      .map((post) => {
        const rawStartDate = post.start_date;
        const rawEndDate = post.end_date;

        const startDate = new Date(
          rawStartDate.replace(/(\d{2})[/-](\d{2})[/-](\d{4})/, "$2/$1/$3"),
        );
        const endDate = rawEndDate
          ? new Date(
              rawEndDate.replace(/(\d{2})[/-](\d{2})[/-](\d{4})/, "$2/$1/$3"),
            )
          : null;

        return {
          ...post,
          startDateObj: startDate,
          endDateObj: endDate,
          formattedStartDate: formatDate(startDate),
          formattedEndDate: endDate ? formatDate(endDate) : null,
          day: startDate.getDate(),
          month: startDate.getMonth(),
          year: startDate.getFullYear(),
        };
      })
      .filter(
        (event) =>
          event.startDateObj >= oneMonthAgo && event.startDateObj <= today,
      )
      .sort((a, b) => b.startDateObj.getTime() - a.startDateObj.getTime())
      .slice(0, 5);
  }, [data]);

  return { data: recentEvents, ...rest };
};

// GET POST
export const useGetPostById = (post_id: string) => {
  return useQuery({
    queryKey: ["post", post_id],
    queryFn: async () => {
      const response = await api.get(`/post/${post_id}`);
      return response.data.data;
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

      queryClient.setQueryData(["posts"], (old: any = []) => [
        ...old,
        {
          ...newPost,
          post_id: uuid4(),
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

export const useLikePost = () => {
  return useMutation({
    mutationFn: async (post_id: string) => {
      const response = await api.post(`/post/${post_id}/like`);
      return response.data;
    },
  });
};

export const useRemoveLikePost = () => {
  return useMutation({
    mutationFn: async (post_id: string) => {
      const response = await api.delete(`/post/${post_id}/like`);
      return response.data;
    },
  });
};
