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
} from '../../hooks/usePost';
import { useGetPostComments, useCommentPost } from '../../hooks/useComment'
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
  const navigate = useNavigate();
  const { state } = useLocation();
  const { post_id } = useParams<{ post_id: string }>();

  const {userId: currentUser, isAuthenticated} = useAuthContext()

  const [newComment, setNewComment] = useState("");
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyImage, setReplyImage] = useState<File | null>(null);
  const [replyImagePreview, setReplyImagePreview] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [commentImagePreview, setCommentImagePreview] = useState<string | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // API hooks
  const { data: post, isLoading: isLoadingPost } = useGetPostById(post_id || "");
  const { data: comments, isLoading: isLoadingComment } = useGetPostComments(post_id || "");

  const commentPostMutation = useCommentPost();


  const handleAddComment = () => {
    if (!post) return;

    if (newComment.trim() != "" || commentImage) {
      commentPostMutation.mutate({
          post_id: post.post_id,
          content: newComment,
          user_id: currentUser || "",
          username: "You",
      });
      setNewComment("")
    }
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
        category={post.post_type}
        startDate={post.start_date}
        endDate={post.end_date}
        image={post.media_urls?.[0]}
        onBack={() => 
          navigate(isAuthenticated ? "/newsuser" : "/news")
        }
      />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-10">
          <div className="p-6 md:p-8">
            <PostActions
              post={post}
              commentCount={countComments(comments||[])}
              onCommentClick={() => document.getElementById("commentSection")?.scrollIntoView({ behavior: "smooth" })}
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
                <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm px-2 py-1 rounded-full">
                  {
                    countComments(comments || [])
                  }
                </span>
              // )
              }
            </h2>
          </div>

          { isAuthenticated &&
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
          }
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
