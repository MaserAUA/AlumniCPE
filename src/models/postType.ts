export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Post {
  post_id: string;
  title: string;
  content: string;
  media_urls: string[];
  post_type?: string;
  start_date?: string;
  end_date?: string;
  created_timestmap: string;
  likes_count: number;
  has_liked: boolean;
  comments_count: number;
  author_user_id: string;
}

export interface FormattedPost extends Post {
  startDateObj: Date;
  endDateObj: Date | null;
  formattedStartDate: string;
  formattedEndDate: string | null;
  daysUntil: number;
  isUpcoming: boolean;
  isPast: boolean;
  countdown?: string;
}
