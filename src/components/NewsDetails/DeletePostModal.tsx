import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { useDeletePost } from '../../api/post';
import { Post } from "../../models/postType";
import { useAuthContext } from '../../context/auth_context';
import BaseModal from '../common/BaseModal';

interface DeletePostModalProps {
  post: Post;
  onClose: () => void;
}

const DeletePostModal: React.FC<DeletePostModalProps> = ({ post, onClose }) => {
  const { userId } = useAuthContext();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const deletePostMutation = useDeletePost();

  const showToast = (message: string, isSuccess = true) => {
    const toast = document.createElement("div");
    toast.className = `
      fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50
      ${isSuccess ? 'bg-green-500' : 'bg-red-500'} text-white
    `;
    toast.innerHTML = `
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          ${isSuccess
            ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`
            : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>`
          }
        </svg>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, isSuccess ? 1000 : 2000);
  };

  const handleDeletePost = useCallback(() => {
    setIsDeleting(true);
    deletePostMutation.mutate(post.post_id, {
      onSuccess: () => {
        showToast('Post deleted successfully', true);
        setIsDeleting(false);
        onClose();
        setTimeout(() => navigate(-1), 2000);
      },
      onError: (err) => {
        showToast(`Failed to delete post: ${err.message || 'Unknown error'}`, false);
        setIsDeleting(false);
        onClose();
      }
    });
  }, [deletePostMutation, post.post_id, navigate, onClose]);

  return (
    <BaseModal isOpen={true} onClose={onClose} size="md">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaTrashAlt className="mr-2 text-red-500" /> Delete Post
          </h3>
          {!isDeleting && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Warning */}
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6 flex items-start">
          <FaExclamationTriangle className="text-red-500 mr-3 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-1">
              Are you sure you want to delete this post?
            </p>
            <p className="text-sm text-red-700 dark:text-red-400">
              This action cannot be undone. All comments and likes will be permanently removed.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeletePost}
            className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center ${
              isDeleting ? "opacity-75 cursor-not-allowed" : ""
            }`}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Spinner />
            ) : (
              <>
                <FaTrashAlt className="mr-2" />
                Delete Post
              </>
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

// Small Spinner Component
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default DeletePostModal;
