import { CommentOnPostForm, CreatePostForm, DeletePostParams, EditCommentForm, EditReplyCommentForm, LikeCommentPost, LikePostParams, RemoveCommentForm, RemoveLikeCommentPost, RemoveLikePostParams, RemoveReplyCommentForm, ReplyCommentOnPostForm, ReportPostForm, UpdatePostParams, Upload } from "../models/post";

import api from "../configs/api";
import { useMutation } from "@tanstack/react-query"

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

//Newsdetail start fuction

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
        mutationFn: async (reportData: ReportPostForm) => {
            const response = await api.post("/v1/utils/report", reportData);
            return response.data;
        }
    })
}

export const useDeletePost = () => {
    return useMutation({
        mutationFn: async (post_id: DeletePostParams) => {
            const response = await api.delete("/post/"+post_id);
            return response.data;
        }
    })
}

export const useLikePost = () => {
    return useMutation({
        mutationFn: async (post_id: LikePostParams) => {
            const response = await api.post("/post/"+post_id+"/like");
            return response.data;
        }
    })
}

export const useRemoveLikePost = () => {
    return useMutation({
        mutationFn: async (post_id: RemoveLikePostParams) => {
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

// 4/6/2025 

export const useReplyCommentPost = () => {
    return useMutation({
        mutationFn: async (data: ReplyCommentOnPostForm) => {
          const response = await api.post(`/post/${data.post_id}/comment/${data.comment_id}`,{ comment: data.reply });
            return response.data;
        }
    })
}

export const useEditCommentPost = () => {
    return useMutation({
        mutationFn: async (data: EditCommentForm) => {
           const response = await api.put(`/post/${data.post_id}/comment/${data.comment_id}`,{ comment: data.comment });
           return response.data;
        }
    })
}

export const useEditReplyCommentPost = () => {
    return useMutation({
        mutationFn: async (data: EditReplyCommentForm) => {
           const response = await api.put(`/post/${data.post_id}/comment/${data.comment_id}`,{ comment: data.comment });
           return response.data;
        }
    })
}

export const useRemoveReplyCommentPost = () => {
    return useMutation({
        mutationFn: async (data: RemoveReplyCommentForm) => {
            // แก้ไข URL ให้ถูกต้องโดยรวม comment_id ใน path
            const response = await api.delete(`/post/${data.post_id}/comment/${data.comment_id}`);
            return response.data;
        }
    })
}

export const useRemoveCommentPost = () => {
    return useMutation({
        mutationFn: async (data: RemoveCommentForm) => {
            const response = await api.delete(`/post/${data.post_id}/comment/${data.comment_id}`);
            return response.data;
        }
    })
}

export const useLikeCommentPost = () => {
    return useMutation({
      mutationFn: async (data: LikeCommentPost) => {
        const response = await api.post(`/post/comment/${data.comment_id}/like`)
        return response.data;
      }
    })
  }
  
  export const useRemoveLikeCommentPost = () => {
    return useMutation({
      mutationFn: async (data: RemoveLikeCommentPost) => {
        const response = await api.delete(`/post/comment/${data.comment_id}/like`)
        return response.data;
      }
    })
  }

export const useUploadFile = () => {
    return useMutation({
        mutationFn: async (file: File) => {
            // Check file size (5MB limit)
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > MAX_FILE_SIZE) {
                throw new Error(`File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
            }

            const formData = new FormData();
            formData.append('file', file);
            
            try {
                const response = await api.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                
                if (!response.data.url) {
                    throw new Error('Invalid response from server');
                }
                
                return {
                    url: response.data.url,
                    name: file.name,
                    size: file.size
                };
            } catch (error) {
                if (error.response?.status === 401) {
                    throw new Error('Please login to upload files');
                } else if (error.response?.status === 413) {
                    throw new Error('File size is too large');
                } else {
                    throw new Error('Failed to upload file. Please try again.');
                }
            }
        }
    });
}

