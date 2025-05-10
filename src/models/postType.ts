export interface ReportType {
  report_id: string;
  status: "pending" | "reviewed" | "resolved";
  type: "post" | "comment" | "user";
  category: "spam" | "harassment" | "hate_speech" | "misinformation" | "other";
  additional: string;
  created_timestamp: number;

  post_id: string;
  post_type: string;
  title: string;
  content: string;
  media_urls: string[];

  author_user_id: string;
  author_username: string;
  author_profile_picture: string;
  author_name: string;

  reporter_user_id: string;
  reporter_username: string;
  reporter_profile_picture: string;
  reporter_name: string;
}

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
  redirect_link: string;
  post_type?: string;
  start_date?: string;
  end_date?: string;
  created_timestmap: string;
  has_liked: boolean;
  likes_count: number;
  views_count: number;
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
