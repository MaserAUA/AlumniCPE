export interface CreatePostForm {
    "title": string
    "content": string
    "post_type": string
    "visibility": string
}

export interface UpdatePostParams {
    post_id: string
    post_info: {
        "title": string
        // "content": string
    }
}

//4/5/2025

export interface LikePostParams {
    post_id: string
    post_info: {
        "title": string
        "content": string
        "post_type": string
        "visibility": string
    }
}
export interface RemoveLikePostParams {
    post_id: string
    post_info: {
        "title": string
        "content": string
        "post_type": string
        "visibility": string
    }
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
    reply: string;        
  }

export interface EditCommentForm{
    comment: string
}

export interface LikeCommentParams{
    post_id: string
    post_info: {
        "title": string
        "content": string
        "post_type": string
        "visibility": string
    }
}

export interface RemoveLikeCommentParams{
    post_id: string
    post_info: {
        "title": string
        "content": string
        "post_type": string
        "visibility": string
    }
}

export interface Upload{
    "title": string
    "content": string
    "post_type": string
    "visibility": string
}