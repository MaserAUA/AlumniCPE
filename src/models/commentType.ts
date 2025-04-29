export interface Comment extends BaseComment {
  comment_id: string;
  replies?: Comment[];
}

export interface BaseComment {
  user_id: string;
  username: string;
  name: string;
  profile_picture: string;
  content: string;
  created_timestamp: string;
  like_count: number;
  has_like: boolean;
  image: string | null;
}
