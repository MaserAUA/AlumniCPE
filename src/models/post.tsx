export interface CreatePostForm {
    title: string;      
    content: string;    
    post_type: string;  
    start_date?: string; 
    end_date?: string;   
    media_url?: string[] | string; 
    visibility?: string; 
}

export interface GetAllPost {
    post_id: string;
    title: string;
    post_type: string;
    start_date?: string;
    end_date?: string;
    name?: string;
    user_id: string;
    profile_picture?: string;
    like_count?: number;
    view_count?: number;
    comment_count?: number;
}

export interface GetPostById {
    
}
export interface UpdatePostParams {
    post_id: string;
    post_info: {
        title?: string;
        content?: string;
        post_type?: string;
        start_date?: string;
        end_date?: string;
        media_url?: string[] | string;
        visibility?: string;
    }
}

export interface DeletePostParams {
    post_id: string;
}

//4/5/2025

export interface LikePostParams {
    post_id: string
    // post_info: {
    //     "title": string
    //     "content": string
    //     "post_type": string
    //     "visibility": string
    // }
}
export interface RemoveLikePostParams {
    post_id: string
    // post_info: {
    //     "title": string
    //     "content": string
    //     "post_type": string
    //     "visibility": string
    // }
}

export interface ReportPostForm{
    id: string
    type: string
    category: string
    additional: string
} 

export interface CommentOnPostForm{
    comment: string
    post_id: string
}

export interface ReplyCommentOnPostForm {
    post_id: string;      
    comment_id: string; 
    comment: string;  
    reply: string;
     
  }

  export interface EditCommentForm {
    post_id: string;
    comment_id: string;
    comment: string;
}

export interface RemoveCommentForm {
    post_id: string;
    comment_id: string;
}

export interface LikeCommentPost{
    post_id: string
    comment_id: string
    // post_info: {
    //   "title": string
    //   "content": string
    //   "post_type": string
    //   "visibility": string
    // }
  }

  export interface RemoveLikeCommentPost{
    post_id: string
    comment_id: string
    // post_info: {
    //   "title": string
    //   "content": string
    //   "post_type": string
    //   "visibility": string
    // }
  }
export interface Upload{
  file: File;
  title?: string;
  content?: string;
  post_type?: string;
  visibility?: string;
}