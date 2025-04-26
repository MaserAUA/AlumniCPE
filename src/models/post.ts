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
  };
}

export interface DeletePostParams {
  post_id: string;
}

export interface ReportPostForm {
  id: string;
  type: string;
  category: string;
  additional: string;
}

export interface CommentFormBase {
  post_id: string;
  comment_id: string;
}

export interface CommentOnPostForm {
  post_id: string;
  content: string;
  user_id: string;
  username: string;
}

export interface ReplyCommentOnPostForm extends CommentFormBase {
  content: string;
  user_id?: string;
  username?: string;
}

export interface EditCommentForm extends CommentFormBase {
  content: string;
}

export interface RemoveCommentForm extends CommentFormBase {}

export interface EditReplyCommentForm extends CommentFormBase {}

export interface RemoveReplyCommentForm extends CommentFormBase {}

export interface LikeCommentPost extends CommentFormBase {}

export interface RemoveLikeCommentPost extends LikeCommentPost {}

export interface Upload {
  file: File;
  title?: string;
  content?: string;
  post_type?: string;
  visibility?: string;
}
