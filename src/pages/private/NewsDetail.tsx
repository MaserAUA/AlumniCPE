import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';
import {
  FaComment,
  FaExclamationTriangle,
  FaFlag,
  FaHeart,
  FaRegHeart,
  FaTimes,
  FaTrashAlt,
  FaEdit,
} from 'react-icons/fa';
import {
  useGetPostById,
  useRemoveLikePost,
  useDeletePost,
  useLikePost,
  // useReportPostForm,
} from '../../api/post';
import { useGetPostComments, useCommentPost } from '../../api/comment'
import { countComments } from '../../utils/comment'
import { Post } from '../../models/postType'
import { Comment } from '../../models/commentType'
import CommentItem from '../../components/NewsDetails/CommentItem';
import CommentForm from '../../components/NewsDetails/CommentForm';
import PostHeader from '../../components/NewsDetails/PostHeader';
import PostActions from '../../components/NewsDetails/PostAction';
import ImageGallery from '../../components/NewsDetails/ImageGallery';
import EditPostModal from '../../components/NewsDetails/EditPostModal';
import { useAuthContext } from '../../context/auth_context';

const NewsDetail: React.FC<{ onUpdatePost: (updatedPost: any) => void }> = ({ onUpdatePost }) => {
  const { post_id } = useParams<{ post_id: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();

  const {userId: currentUser} = useAuthContext()
  
  // State
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const [postLiked, setPostLiked] = useState(false);
  const [postLikeCount, setPostLikeCount] = useState(0);

  // const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [newReply, setNewReply] = useState("");
  const [replyImage, setReplyImage] = useState<File | null>(null);
  const [replyImagePreview, setReplyImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [commentImagePreview, setCommentImagePreview] = useState<string | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // API hooks
  const { data: post, isLoading: isLoadingPost } = useGetPostById(post_id || "");
  const { data: comments, isLoading: isLoadingComment } = useGetPostComments(post_id || "");

  const deletePostMutation = useDeletePost();
  const likePostMutation = useLikePost();
  const removelikePostMutation = useRemoveLikePost();
  // const reportPostMutation = useReportPostForm();
  const commentPostMutation = useCommentPost();
  
  // const likecommentPostMutation = useLikeCommentPost();
  // const removelikecommentPostMutation = useRemoveLikeCommentPost();


  const handlePostLike = (e: React.MouseEvent) => {
    e.stopPropagation();
  
    if (!post) return;

    if (postLiked) {
      setPostLiked(false);
      setPostLikeCount((prev) => Math.max(0, prev - 1));
      removelikePostMutation.mutate(post.post_id, {
        onSuccess: (res) => {
          const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
          likedPosts[post.post_id] = {
            liked: false,
            likeCount: postLikeCount - 1
          };
          localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
        },
        onError: (err) => {
          setPostLiked(true);
          setPostLikeCount((prev) => prev + 1);
        },
      });
    } else {
      setPostLiked(true);
      setPostLikeCount((prev) => prev + 1);
      likePostMutation.mutate(post.post_id, {
        onSuccess: (res) => {
          const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
          likedPosts[post.post_id] = {
            liked: true,
            likeCount: postLikeCount + 1
          };
          localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
        },
        onError: (err) => {
          setPostLiked(false);
          setPostLikeCount((prev) => Math.max(0, prev - 1));
        },
      });
    }
  };

  const handleUpdatePost = (updatedPost: Post) => {
    window.location.reload();
  };

  // const handleReportSubmit = async () => {
  //   if (!post) return;
  //
  //   try {
  //     const report = {
  //       id: post.post_id,
  //       type: "post",
  //       category: reportReason,
  //       additional: reportDescription,
  //     };
  //     await reportPostMutation.mutateAsync(report);
  //     setShowReportModal(false);
  //     setReportReason("");
  //     setReportDescription("");
  //     // Show success toast
  //   } catch (error) {
  //     console.error("Error reporting post:", error);
  //     // Show error toast
  //   }
  // };

  const handleAddComment = () => {
    if (!post) return;

    if (newComment.trim() || commentImage) {
      // const now = new Date();
      // const newCommentObj = {
      //   comment_id: "",
      //   author: "You",
      //   avatar: "https://ui-avatars.com/api/?name=You&background=0D8ABC&color=fff",
      //   text: newComment,
      //   date: now.toLocaleDateString("en-US"),
      //   time: now.toLocaleTimeString("en-US", {
      //     hour: "2-digit",
      //     minute: "2-digit",
      //   }),
      //   replies: [],
      //   liked: false,
      //   likeCount: 0,
      //   image: commentImagePreview,
      // };

      commentPostMutation.mutate({
          post_id: post.post_id,
          content: newComment,
          user_id: currentUser || "",
          username: "You",
      });
      setNewComment("")
    }
  };

  const handleDeletePost = () => {
    if (!post) return;

    setIsDeleting(true);
    deletePostMutation.mutate(post.post_id, {
      onSuccess: () => {
        setIsDeleting(false);
        setShowDeleteConfirmModal(false);
        if (onUpdatePost) {
          onUpdatePost({ deleted: true, postId: post.post_id });
        }
        navigate(-1);
      },
      onError: () => {
        setIsDeleting(false);
      },
    });
  };

  const handleCommentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCommentImage(file);
      setCommentImagePreview(URL.createObjectURL(file));
    }
  };

  const handleReplyImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReplyImage(file);
      setReplyImagePreview(URL.createObjectURL(file));
    }
  };

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          // Show copied to clipboard toast
        })
        .catch(console.error);
    }
  };

  const toggleRepliesVisibility = (commentId: string) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (isLoadingPost || isLoadingComment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-indigo-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-indigo-500">
      <PostHeader
        title={post.title}
        category={post.category}
        startDate={post.startDate}
        endDate={post.endDate}
        image={post.images?.[0]}
        onBack={() => navigate(-1)}
      />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-10">
          <div className="p-6 md:p-8">
            <PostActions
              // TODO: Return user like boolean
              liked={false}
              likeCount={post.likes_count}
              commentCount={countComments(comments||[])}
              isAuthor={post.author_user_id == currentUser}
              onLike={handlePostLike}
              onCommentClick={() => document.getElementById("commentSection")?.scrollIntoView({ behavior: "smooth" })}
              onShare={handleShare}
              onEdit={() => setShowEditModal(true)}
              onDelete={() => setShowDeleteConfirmModal(true)}
              onReport={() => setShowReportModal(true)}
            />

            <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {post.content || "No content available for this post"}
              </p>
            </div>

            {post.media_urls && post.media_urls.length > 0 && (
              <ImageGallery
                images={post.media_urls}
                onImageClick={setSelectedImage}
              />
            )}
          </div>
        </article>
      </div>
      <section id="commentSection" className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden" >
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-2 rounded-full mr-2">
                <FaComment />
              </span>
              Comments: 
              {
              //   comments?.length || 0 > 0 && (
                <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm px-2 py-1 rounded-full">
                  {
                    countComments(comments || [])
                  }
                </span>
              // )
              }
            </h2>
          </div>

          <CommentForm
            onSubmit={handleAddComment}
            value={newComment}
            onChange={setNewComment}
            onImageUpload={handleCommentImageUpload}
            imagePreview={commentImagePreview}
            onRemoveImage={() => {
              setCommentImage(null);
              setCommentImagePreview(null);
            }}
          />

          {
            comments?.length || 0 > 0 ? (
            <div className="space-y-8">
              {comments.map((comment) => (
                <CommentItem
                  post={post}
                  key={comment.comment_id}
                  comment={comment}
                  replyImagePreview={replyImagePreview}
                />
              ))}
            </div>
            ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-750 rounded-xl">
              <div className="bg-white dark:bg-gray-700 inline-flex rounded-full p-4 mb-4 shadow-md">
                <FaComment className="text-3xl text-blue-400 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                No comments yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Be the first to comment on this post
              </p>
            </div>)
          }
        </div>
      </section>
  </div>
  );
};

export default NewsDetail;
