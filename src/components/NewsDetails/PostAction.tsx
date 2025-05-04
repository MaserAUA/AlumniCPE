import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaEllipsisV, FaEdit, FaTrashAlt, FaFlag, FaLink } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../models/postType'

import {
  useGetPostById,
  useRemoveLikePost,
  useDeletePost,
  useLikePost,
} from '../../hooks/usePost';
import { useAuthContext } from '../../context/auth_context';
import EditPostModal from './EditPostModal';
import ReportPostModal from './ReportPostModal';
import DeletePostModal from './DeletePostModal';

interface PostActionsProps {
  post: Post;
  commentCount: number;
  onCommentClick: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  post,
  commentCount,
  onCommentClick,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const { isAuthenticated, userId } = useAuthContext()

  const navigate = useNavigate();

  const likePostMutation = useLikePost();
  const removeLikePostMutation = useRemoveLikePost();

  const handlePostLike = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!post) return;

    if (post.has_liked) {
      removeLikePostMutation.mutate(post.post_id);
    } else {
      likePostMutation.mutate(post.post_id);
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

  const handleLinkClick = () => {
    if (post.redirect_link) {
      window.open(post.redirect_link, '_blank');
    }
  };

  return (
    <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
      <div className="flex space-x-8">
        <button
          onClick={handlePostLike}
          disabled={!isAuthenticated}
          className="group flex flex-col items-center space-y-1 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 focus:outline-none relative"
          aria-label={post.has_liked ? "Unlike" : "Like"}
        >
          <div className="relative transform transition-transform duration-300 group-hover:scale-110">
            {post.has_liked ? (
              <FaHeart className="text-red-500 text-3xl animate-pulse" />
            ) : (
              <FaRegHeart className="text-3xl group-hover:animate-bounce" />
            )}
          </div>
          <span className="font-semibold text-sm group-hover:scale-105 transition-transform duration-300">
            {post.likes_count} {post.likes_count === 1 ? 'Like' : 'Likes'}
          </span>
        </button>

        <button
          onClick={onCommentClick}
          className="group flex flex-col items-center space-y-1 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 focus:outline-none"
          aria-label="Comments"
        >
          <FaComment className="text-3xl group-hover:animate-bounce" />
          <span className="font-semibold text-sm group-hover:scale-105 transition-transform duration-300">
            {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
          </span>
        </button>

        <button
          onClick={handleShare}
          className="group flex flex-col items-center space-y-1 text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-all duration-300 focus:outline-none"
          aria-label="Share"
        >
          <FaShare className="text-3xl group-hover:animate-bounce" />
          <span className="font-semibold text-sm group-hover:scale-105 transition-transform duration-300">
            Share
          </span>
        </button>

        {post.redirect_link && (
          <button
            onClick={handleLinkClick}
            className="group flex flex-col items-center space-y-1 text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-all duration-300 focus:outline-none"
            aria-label="Visit Link"
          >
            <FaLink className="text-3xl group-hover:animate-bounce" />
            <span className="font-semibold text-sm group-hover:scale-105 transition-transform duration-300">
              Visit Link
            </span>
          </button>
        )}
      </div>

      { post.author_user_id === userId && (
        <div className="relative">
          <button
            className="p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300 focus:outline-none group"
            aria-label="More options"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
          >
            <FaEllipsisV className="text-xl group-hover:rotate-90 transition-transform duration-300" />
          </button>
          {
            showMoreOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
              {post.author_user_id === userId && (
                <button
                  onClick={() => {
                    setShowMoreOptions(false);
                    setShowEditModal(true);
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group"
                >
                  <FaEdit className="mr-3 text-lg group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium group-hover:translate-x-1 transition-transform duration-300">Edit Post</span>
                </button>
              )}
              <button
                onClick={() => {
                  setShowMoreOptions(false);
                  setShowDeleteModal(true);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group"
              >
                <FaTrashAlt className="mr-3 text-lg group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium group-hover:translate-x-1 transition-transform duration-300">Delete Post</span>
              </button>
              <button
                onClick={() => {
                  setShowMoreOptions(false);
                  setShowReportModal(true);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group"
              >
                <FaFlag className="mr-3 text-lg group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium group-hover:translate-x-1 transition-transform duration-300">Report Post</span>
              </button>
            </div>
          )}
        </div>
        )
      }
      { showEditModal && (
        <EditPostModal
          post={post}
          onClose={()=>{
            setShowEditModal(false)
          }}
        />
      )}
      { showReportModal && (
        <ReportPostModal
          post={post}
          onClose={()=>{
            setShowReportModal(false);
          }}
        />
      )}
      { showDeleteModal && (
        <DeletePostModal
          post={post}
          onClose={()=>{
            setShowDeleteModal(false);
          }}
        />
      )}
    </div>
  );
};

export default PostActions;
