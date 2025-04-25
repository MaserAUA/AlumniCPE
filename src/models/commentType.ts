export interface Comment extends BaseComment {
  comment_id: string;
  replies?: Comment[];
}

export interface BaseComment {
  user_id: string;
  username: string;
  fullname: string;
  profile_picture: string;
  content: string;
  created_timestamp: string;
  liked: boolean;
  image: string | null;
}
