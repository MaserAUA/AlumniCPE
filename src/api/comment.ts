import {
  CommentOnPostForm,
  EditCommentForm,
  LikeCommentPost,
  RemoveCommentForm,
  RemoveLikeCommentPost,
  ReplyCommentOnPostForm,
} from "../models/post";
import api from "../configs/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuid4 } from "uuid";

// Utility: Recursively clone and insert reply into the correct comment
const addReplyToCommentTree = (
  comments: any[],
  parentId: string,
  reply: any,
): any[] => {
  return comments.map((comment) => {
    if (comment.comment_id === parentId) {
      return {
        ...comment,
        replies: [...(comment.replies || []), reply],
      };
    } else if (comment.replies?.length) {
      return {
        ...comment,
        replies: addReplyToCommentTree(comment.replies, parentId, reply),
      };
    }
    return comment;
  });
};

// Utility: recursively update the content of a comment or reply
const editCommentContent = (
  comments: any[],
  targetId: string,
  newContent: string,
): any[] => {
  return comments.map((comment) => {
    if (comment.comment_id === targetId) {
      return { ...comment, content: newContent };
    } else if (comment.replies?.length) {
      return {
        ...comment,
        replies: editCommentContent(comment.replies, targetId, newContent),
      };
    }
    return comment;
  });
};

// Utility: Recursively replace temp reply with real one
const replaceTempReply = (
  comments: any[],
  parentId: string,
  tempId: string,
  realReply: any,
): any[] => {
  return comments.map((comment) => {
    if (comment.comment_id === parentId) {
      return {
        ...comment,
        replies: (comment.replies || []).map((r: any) =>
          r.comment_id === tempId ? realReply : r,
        ),
      };
    } else if (comment.replies?.length) {
      return {
        ...comment,
        replies: replaceTempReply(comment.replies, parentId, tempId, realReply),
      };
    }
    return comment;
  });
};

// Utility: recursively remove a comment or reply by ID
const removeCommentById = (comments: any[], targetId: string): any[] => {
  return comments
    .map((comment) => {
      if (comment.comment_id === targetId) {
        return null; // remove this comment
      } else if (comment.replies?.length) {
        const updatedReplies = removeCommentById(comment.replies, targetId);
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    })
    .filter(Boolean); // remove nulls
};

// GET COMMENTS FOR A POST
export const useGetPostComments = (post_id: string) => {
  return useQuery({
    queryKey: ["comments", post_id],
    queryFn: async () => {
      const response = await api.get(`/post/${post_id}/comment`);
      return response.data.data;
    },
  });
};

// COMMENT ON A POST
export const useCommentPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CommentOnPostForm) => {
      const response = await api.post(`/post/${data.post_id}/comment`, {
        comment: data.content,
      });
      return response.data.data;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["comments", data.post_id] });
      const tempCommentID = uuid4();

      const previousComments = queryClient.getQueryData([
        "comments",
        data.post_id,
      ]);

      queryClient.setQueryData(["comments", data.post_id], (old: any = []) => [
        ...old,
        {
          comment_id: tempCommentID,
          content: data.content,
          created_timestamp: new Date().toISOString(),
          user_id: data.user_id,
          username: data.username,
        },
      ]);

      return { previousComments, tempCommentID };
    },
    onError: (_err, data, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", data.post_id],
          context.previousComments,
        );
      }
    },
    onSettled: (_data, _err, _variable, context) => {
      if (_data && context?.tempCommentID) {
        queryClient.setQueryData(
          ["comments", _variable.post_id],
          (old: any = []) => {
            return old
              .filter((c: any) => c.comment_id !== context.tempCommentID)
              .concat(_data);
          },
        );
      }
      queryClient.invalidateQueries({
        queryKey: ["comments", _variable.post_id],
      });
    },
  });
};

// REPLY TO A COMMENT
export const useReplyCommentPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReplyCommentOnPostForm) => {
      const response = await api.post(
        `/post/${data.post_id}/comment/${data.comment_id}`,
        { comment: data.content },
      );
      return response.data.data; // assumes full reply comment object
    },

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["comments", data.post_id] });

      const tempId = uuid4();
      const previousComments = queryClient.getQueryData<any[]>([
        "comments",
        data.post_id,
      ]);

      const newReply = {
        comment_id: tempId,
        content: data.content,
        created_timestamp: new Date().toISOString(),
        user_id: data.user_id,
        username: data.username,
        isTemp: true,
      };

      const updatedComments = addReplyToCommentTree(
        previousComments || [],
        data.comment_id,
        newReply,
      );

      queryClient.setQueryData(["comments", data.post_id], updatedComments);

      return { previousComments, tempId };
    },

    onError: (_err, data, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", data.post_id],
          context.previousComments,
        );
      }
    },

    onSettled: (serverReply, _err, variables, context) => {
      if (serverReply && context?.tempId) {
        queryClient.setQueryData(
          ["comments", variables.post_id],
          (old: any[] = []) =>
            replaceTempReply(
              old,
              variables.comment_id,
              context.tempId,
              serverReply,
            ),
        );
      }

      // Optional: revalidate to ensure sync
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.post_id],
      });
    },
  });
};

// EDIT COMMENT
export const useEditCommentPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EditCommentForm) => {
      const response = await api.put(
        `/post/${data.post_id}/comment/${data.comment_id}`,
        { comment: data.content },
      );
      return response.data;
    },

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["comments", data.post_id] });

      const previousComments = queryClient.getQueryData<any[]>([
        "comments",
        data.post_id,
      ]);

      const updatedComments = editCommentContent(
        previousComments || [],
        data.comment_id,
        data.content,
      );

      queryClient.setQueryData(["comments", data.post_id], updatedComments);

      return { previousComments };
    },

    onError: (_err, data, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", data.post_id],
          context.previousComments,
        );
      }
    },

    onSettled: (_data, _err, data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.post_id] });
    },
  });
};

// DELETE COMMENT
export const useRemoveCommentPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RemoveCommentForm) => {
      const response = await api.delete(
        `/post/${data.post_id}/comment/${data.comment_id}`,
      );
      return response.data;
    },

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["comments", data.post_id] });

      const previousComments = queryClient.getQueryData<any[]>([
        "comments",
        data.post_id,
      ]);

      const updatedComments = removeCommentById(
        previousComments || [],
        data.comment_id,
      );

      queryClient.setQueryData(["comments", data.post_id], updatedComments);

      return { previousComments };
    },

    onError: (_err, data, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", data.post_id],
          context.previousComments,
        );
      }
    },

    onSettled: (_data, _err, data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.post_id] });
    },
  });
};

// LIKE COMMENT
export const useLikeCommentPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LikeCommentPost) => {
      const response = await api.post(`/post/comment/${data.comment_id}/like`);
      return response.data;
    },
    onSettled: (_data, _err, data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.post_id] });
    },
  });
};

// REMOVE LIKE FROM COMMENT
export const useRemoveLikeCommentPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RemoveLikeCommentPost) => {
      const response = await api.delete(
        `/post/comment/${data.comment_id}/like`,
      );
      return response.data;
    },
    onSettled: (_data, _err, data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.post_id] });
    },
  });
};
