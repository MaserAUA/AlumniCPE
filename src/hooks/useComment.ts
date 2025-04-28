import {
  CommentOnPostForm,
  EditCommentForm,
  LikeCommentPost,
  RemoveCommentForm,
  RemoveLikeCommentPost,
  ReplyCommentOnPostForm,
} from "../models/post";
import {
  getPostComments,
  commentPost,
  replyCommentPost,
  editCommentPost,
  removeCommentPost,
  likeCommentPost,
  removeLikeCommentPost,
} from "../api/comment";
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

const likeCommentInTree = (comments: any[], commentId: string): any[] => {
  return comments.map((comment) => {
    if (comment.comment_id === commentId) {
      return {
        ...comment,
        like_count: (comment.like_count || 0) + 1,
        has_like: true,
      };
    } else if (comment.replies?.length) {
      return {
        ...comment,
        replies: likeCommentInTree(comment.replies, commentId),
      };
    }
    return comment;
  });
};

const removeLikeCommentInTree = (comments: any[], commentId: string): any[] => {
  return comments.map((comment) => {
    if (comment.comment_id === commentId) {
      return {
        ...comment,
        like_count: Math.max((comment.like_count || 1) - 1, 0),
        has_like: false,
      };
    } else if (comment.replies?.length) {
      return {
        ...comment,
        replies: removeLikeCommentInTree(comment.replies, commentId),
      };
    }
    return comment;
  });
};

// GET COMMENTS FOR A POST
export const useGetPostComments = (post_id: string) => {
  return useQuery({
    queryKey: ["comments", post_id],
    queryFn: () => getPostComments(post_id),
  });
};

// COMMENT ON A POST
export const useCommentPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CommentOnPostForm) => commentPost(payload),
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
      console.error(_err);
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
    mutationFn: async (payload: ReplyCommentOnPostForm) =>
      replyCommentPost(payload),
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
    mutationFn: (payload: EditCommentForm) => editCommentPost(payload),
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
    mutationFn: (payload: RemoveCommentForm) => removeCommentPost(payload),
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
    mutationFn: (payload: LikeCommentPost) => likeCommentPost(payload),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["comments", data.post_id] });

      const previousComments = queryClient.getQueryData<any[]>([
        "comments",
        data.post_id,
      ]);

      const updatedComments = likeCommentInTree(
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

// REMOVE LIKE FROM COMMENT
export const useRemoveLikeCommentPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RemoveLikeCommentPost) =>
      removeLikeCommentPost(payload),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["comments", data.post_id] });

      const previousComments = queryClient.getQueryData<any[]>([
        "comments",
        data.post_id,
      ]);

      const updatedComments = removeLikeCommentInTree(
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
