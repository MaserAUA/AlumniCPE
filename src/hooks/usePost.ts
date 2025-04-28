import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  CreatePostForm,
  ReportPostForm,
  UpdatePostParams,
} from "../models/post";
import { Post, FormattedPost } from "../models/postType";
import { v4 as uuid4 } from "uuid";
import api from "../configs/api";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  removeLikePost,
} from "../api/post";
import { useMemo } from "react";
import moment from "moment";

const formatAPIDate = (dateString?: string): Date | null => {
  if (!dateString) return null;
  if (dateString.includes("/")) {
    const [day, month, year] = dateString.split("/");
    return new Date(`${month}/${day}/${year}`);
  }
  return new Date(dateString);
};

// GET ALL POSTS
export const useGetAllPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => getAllPosts(),
  });
};

export const useFormattedPosts = () => {
  const { data: rawPosts, ...queryResult } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await api.get("/post/all");
      return response.data.data;
    },
  });

  const formattedPosts = useMemo(() => {
    if (!rawPosts || !Array.isArray(rawPosts)) return [];

    const now = moment();

    return rawPosts.map((post): FormattedPost => {
      const isEvent = post.post_type === "event";
      const startDate = isEvent ? post.start_date : post.created_timestmap;
      const endDate = isEvent ? post.end_date : post.created_timestmap;

      const startDateObj = formatAPIDate(startDate) || new Date();
      const endDateObj = formatAPIDate(endDate) || new Date();

      const momentStart = moment(startDateObj);
      const isUpcoming = momentStart.isAfter(now);
      const isPast = momentStart.isBefore(now);

      return {
        ...post,
        startDateObj,
        endDateObj,
        formattedStartDate: momentStart.format("MMM D, YYYY"),
        formattedEndDate: endDateObj
          ? moment(endDateObj).format("MMM D, YYYY")
          : null,
        daysUntil: momentStart.diff(now, "days"),
        isUpcoming,
        isPast,
      };
    });
  }, [rawPosts]);

  return {
    ...queryResult,
    data: formattedPosts,
    upcomingEvents: useMemo(
      () =>
        formattedPosts.filter(
          (post) => post.post_type === "event" && post.isUpcoming,
        ),
      [formattedPosts],
    ),
    pastEvents: useMemo(
      () =>
        formattedPosts.filter(
          (post) => post.post_type === "event" && post.isPast,
        ),
      [formattedPosts],
    ),
    announcements: useMemo(
      () => formattedPosts.filter((post) => post.post_type === "announcement"),
      [formattedPosts],
    ),
  };
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
    queryFn: () => getPostById(post_id),
  });
};

// CREATE POST
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostForm) => createPost(payload),
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
    mutationFn: async (payload: UpdatePostParams) => updatePost(payload),
    onMutate: async (updatePostParams) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData<any[]>(["posts"]);
      const post_info = {
        title: updatePostParams.title,
        content: updatePostParams.content,
        post_type: updatePostParams.post_type,
        start_date: updatePostParams.start_date,
        end_date: updatePostParams.end_date,
        media_url: updatePostParams.media_url,
        visibility: updatePostParams.visibility,
      };

      queryClient.setQueryData<any[]>(["posts"], (old) =>
        old?.map((post) =>
          post.id === updatePostParams.post_id
            ? { ...post, ...post_info }
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
          ...post_info,
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
    mutationFn: (post_id: string) => deletePost(post_id),
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post_id: string) => likePost(post_id),
    onMutate: async (post_id) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", post_id] });

      const previousPosts = queryClient.getQueryData<any[]>(["posts"]);
      const previousSinglePost = queryClient.getQueryData<any>([
        "post",
        post_id,
      ]);

      queryClient.setQueryData<any[]>(["posts"], (oldPosts) =>
        oldPosts?.map((post) =>
          post.id === post_id
            ? {
                ...post,
                likes_count: (post.likes_count ?? 0) + 1,
                has_liked: true,
              }
            : post,
        ),
      );

      queryClient.setQueryData<any>(["post", post_id], (oldPost) =>
        oldPost
          ? {
              ...oldPost,
              likes_count: (oldPost.likes_count ?? 0) + 1,
              has_liked: true,
            }
          : oldPost,
      );

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
    onSettled: (data, _err, post_id) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", post_id] });
    },
  });
};

export const useRemoveLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post_id: string) => removeLikePost(post_id),
    onMutate: async (post_id) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", post_id] });

      const previousPosts = queryClient.getQueryData<any[]>(["posts"]);
      const previousSinglePost = queryClient.getQueryData<any>([
        "post",
        post_id,
      ]);

      queryClient.setQueryData<any[]>(["posts"], (oldPosts) =>
        oldPosts?.map((post) =>
          post.id === post_id
            ? {
                ...post,
                likes_count: Math.max((post.likes_count ?? 1) - 1, 0),
                has_liked: false,
              }
            : post,
        ),
      );

      queryClient.setQueryData<any>(["post", post_id], (oldPost) =>
        oldPost
          ? {
              ...oldPost,
              likes_count: Math.max((oldPost.likes_count ?? 1) - 1, 0),
              has_liked: false,
            }
          : oldPost,
      );

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
    onSettled: (data, _err, post_id) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", post_id] });
    },
  });
};
