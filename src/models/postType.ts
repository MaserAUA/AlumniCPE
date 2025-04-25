export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Post {
  post_id: string;
  title: string;
  content: string;
  images: string[];
  category?: string;
  startDate?: string;
  endDate?: string;
  likes_count: number;
  comments_count: number;
  author_user_id: string;
}
