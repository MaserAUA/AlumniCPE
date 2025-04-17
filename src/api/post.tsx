import { CommentOnPostForm, CreatePostForm, DeletePostParams, EditCommentForm, LikeCommentPost, LikePostParams, RemoveCommentForm, RemoveLikeCommentPost, RemoveLikePostParams, ReplyCommentOnPostForm, ReportPostForm, UpdatePostParams, Upload } from "../models/post";

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
        mutationFn: async (ReportPostForm: ReportPostForm) => {
            const response = await api.post("/utils/report");
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
           const response = await api.put(`/post/${data.post_id}/comment`);
           return response.data;
        }
    })
}

export const useRemoveCommentPost = () => {
    return useMutation({

        mutationFn: async (data: RemoveCommentForm) => {
            const response = await api.delete(`/post/${data.post_id}/comment`)
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

//   export const useUpload = () => {
//     return useMutation({
//       mutationFn: async (data: Upload) => {
//         const formData = new FormData();
//         formData.append('file', data.file);
              
//         if (data.title) formData.append('title', data.title);
//         if (data.content) formData.append('content', data.content);
//         if (data.post_type) formData.append('post_type', data.post_type);
//         if (data.visibility) formData.append('visibility', data.visibility);
        
//         const response = await api.post("/utils/upload", formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data' 
//           }
//         });
//         return response.data;
//       }
//     });
//   };