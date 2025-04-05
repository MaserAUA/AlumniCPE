import { useMutation } from "@tanstack/react-query"
import api from "../configs/api";
import { CommentOnPostForm, CreatePostForm, ReportPostForm, UpdatePostParams } from "../models/post";
export const useCreatePost = () => {
    return useMutation({
        mutationFn: async (createPostForm: CreatePostForm) => {
            const response = await api.post("/post", createPostForm);
            return response.data;
        }
    });
}

export const useGetAllPost = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await api.get("/post/all");
            return response.data;
        }
    });
}

export const useUpdatePost = () => {
    return useMutation({
        mutationFn: async (updatePostParams: UpdatePostParams) => {
            const response = await api.put("/post/"+updatePostParams.post_id, updatePostParams.post_info);
            return response.data;
        }
    });
}

export const useGetPostById = () => {
    return useMutation({
        mutationFn: async (post_id: string) => {
            const response = await api.get("/post/"+post_id);
            return response.data;
        }
    })
}

export const useReportPostForm = () => {
    return useMutation({
        mutationFn: async (ReportPostForm: ReportPostForm) => {
            const response = await api.post("/utils/report");
            return response.data;
        }
    })
}

export const useDeletePost = () => {
    return useMutation({
        mutationFn: async (post_id: string) => {
            const response = await api.delete("/post/"+post_id);
            return response.data;
        }
    })
}

export const useLikePost = () => {
    return useMutation({
        mutationFn: async (post_id: string) => {
            const response = await api.post("/post/"+post_id+"/like");
            return response.data;
        }
    })
}

export const useRemoveLikePost = () => {
    return useMutation({
        mutationFn: async (post_id: string) => {
            const response = await api.delete("/post/"+post_id+"/like");
            return response.data;
        }
    })
}

export const useCommentPost = () => {
    return useMutation({
        mutationFn: async (post:CommentOnPostForm) => {
            const response = await api.post("/post/"+post.post_id+"/comment",{comment:post.comment});
            return response.data;
        }
    })
}

export const useReplyCommentPost = () => {
    return useMutation({
        mutationFn: async (post_id: string) => {
           // const response = await api.post("/post/"+replyData.post_id+"/comment"+replyData.comment_id,{ reply: replyData.reply });
           // return response.data;
        }
    })
}

export const useEditCommentPost = () => {
    return useMutation({
        mutationFn: async (post_id: string) => {
            const response = await api.put("/post/"+post_id+"/comment");
            return response.data;
        }
    })
}

export const useRemoveCommentPost = () => {
    return useMutation({

        mutationFn: async (post_id: string) => {
            const response = await api.delete("/post/"+post_id+"/comment")
            return response.data;
        }
    })
}
export const useLikeCommentPost = () => {
    return useMutation({

        mutationFn: async (post_id: string) => {
            // const response = await api.post("/post/"+"/comment"+comment_id+"/like")
            // return response.data;
        }
    })
}

export const useRemoveLikeCommentPost = () => {
    return useMutation({

        mutationFn: async (post_id: string) => {
            // const response = await api.delete("/post/"+"/comment"+comment_id+"/like")
            // return response.data;
        }
    })
}