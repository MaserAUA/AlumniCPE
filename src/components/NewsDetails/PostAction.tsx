import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaEllipsisV, FaEdit, FaTrashAlt, FaFlag } from 'react-icons/fa';
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

  return (
    <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
      <div className="flex space-x-6">
        <button
          onClick={handlePostLike}
          disabled={!isAuthenticated}
          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none group relative"
          aria-label={post.has_liked ? "Unlike" : "Like"}
        >
          <div className="relative">
            {post.has_liked ? (
              <FaHeart className="text-red-500 text-xl" />
            ) : (
              <FaRegHeart className="text-xl" />
            )}
          </div>
          <span className="font-medium">{post.likes_count}</span>
        </button>

        <button
          onClick={onCommentClick}
          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors focus:outline-none"
          aria-label="Comments"
        >
          <FaComment className="text-xl" />
          <span className="font-medium">{commentCount}</span>
        </button>
        {post.redirect_link && (
          <a 
            href={post.redirect_link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors"
          >
            View Link
            <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </a>
        )}

        {
          // <button
          //   onClick={handleShare}
          //   className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors focus:outline-none"
          //   aria-label="Share"
          // >
          //   <FaShare className="text-xl" />
          //   <span className="font-medium">Share</span>
          // </button>
        }
      </div>

      { post.author_user_id === userId && (
        <div className="relative">
          <button
            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none"
            aria-label="More options"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
          >
            <FaEllipsisV />
          </button>
          {
            showMoreOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700 overflow-hidden">
              {post.author_user_id === userId && (
                <button
                  onClick={() => {
                    setShowMoreOptions(false);
                    setShowEditModal(true);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <FaEdit className="mr-2" />
                  Edit Post
                </button>
              )}
              <button
                onClick={() => {
                  setShowMoreOptions(false);
                  setShowDeleteModal(true);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <FaTrashAlt className="mr-2" />
                Delete Post
              </button>
              <button
                onClick={() => {
                  setShowMoreOptions(false);
                  setShowReportModal(true);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <FaFlag className="mr-2" />
                Report Post
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
