import React, { useState } from 'react';
import { 
  FaChevronUp,
  FaChevronDown,
  FaReply,
  FaHeart,
  FaImage,
  FaRegHeart,
  FaPencilAlt,
  FaPaperPlane,
  FaTimes,
  FaTrashAlt
} from 'react-icons/fa';
import { 
  useCommentPost,
  useReplyCommentPost,
  useEditCommentPost,
  useRemoveCommentPost,
  useLikeCommentPost,
  useRemoveLikeCommentPost
} from '../../hooks/useComment'
import { Post } from '../../models/postType';
import { Comment } from '../../models/commentType';
import { useAuthContext } from '../../context/auth_context';
import { formatDateTime } from '../../utils/format'
import { countComments } from '../../utils/comment';

interface CommentItemProps {
  post: Post;
  comment: Comment;
  replyImagePreview: string | null;
}

const CommentItem: React.FC<CommentItemProps> = ({
  post,
  comment,
  replyImagePreview,
}) => {
  const [editCommentText, setEditCommentText] = useState<string>(comment.content);
  const [isEditComment, setIsEditComment] = useState<boolean>(false);

  const [replyText, setReplyText] = useState<string>("");
  const [isReply, setIsReply] = useState<boolean>(false);

  const [expandedReplies, setExpandedReplies] = useState<boolean>(false);
  const [replyPreviewExpanded, setReplyPreviewExpanded] = useState<boolean>(false);

  const { userId: currentUser, isAuthenticated } = useAuthContext();

  const isCommentAuthor = currentUser === comment.user_id

  const commentPostMutation = useCommentPost();
  const replyCommentPostMutation = useReplyCommentPost();
  const editCommentPostMutation = useEditCommentPost();
  const removeCommentPostMutation = useRemoveCommentPost();
  const likeCommentPostMutation = useLikeCommentPost();
  const removeLikeCommentPostMutation = useRemoveLikeCommentPost();


  const handleDeleteComment = () => {
    removeCommentPostMutation.mutate({
      post_id: post.post_id,
      comment_id: comment.comment_id,
    });
  };

  const handleSubmitEditComment = () => {
    if (editCommentText.trim()) {
      editCommentPostMutation.mutate({
        post_id: post.post_id,
        comment_id: comment.comment_id,
        content: editCommentText,
      });
      setIsEditComment(false)
    }
  };

  const handleLikeComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (comment?.has_like) {
      removeLikeCommentPostMutation.mutate({
        post_id: post.post_id,
        comment_id: comment.comment_id 
      });
    } else {
      likeCommentPostMutation.mutate({
        post_id: post.post_id,
        comment_id: comment.comment_id 
      });
    }
  };

  const handleAddReply = () => {
    replyCommentPostMutation.mutate({
        post_id: post.post_id,
        comment_id: comment.comment_id,
        content: replyText,
    });
    setIsReply(false)
  };


  return (
  <>
    {
    isEditComment ? (
      <div className="mt-2">
        <textarea
          className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
          rows={3}
          value={editCommentText}
          onChange={(e) =>
            setEditCommentText(e.target.value)
          }
        ></textarea>
        <div className="flex justify-end mt-2 space-x-2">
          <button
            type="button"
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onClick={() => {
              setIsEditComment(false);
              setEditCommentText(comment.content);
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() =>
              handleSubmitEditComment()
            }
          >
            Save
          </button>
        </div>
      </div>
    ) : (
    <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 p-5 shadow-sm mb-6">
      <div className="flex">
        <img
          className="h-10 w-10 rounded-full object-cover mr-4 ring-2 ring-blue-100 dark:ring-blue-800"
          src={comment.profile_picture === "" ?  comment.profile_picture : `https://ui-avatars.com/api/?name=${comment.username}&background=0D8ABC&color=fff` }
          alt={comment.username}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${comment.username}&background=0D8ABC&color=fff`;
          }}
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {comment.fullname} {comment.username}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDateTime(comment.created_timestamp)}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {
              // LIKE COMMENT
              <button
                onClick={(e) => handleLikeComment(e)}
                disabled={!isAuthenticated}
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <div className="relative">
                  {comment.has_like? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                </div>
                <span className="ml-1 text-sm">{comment.like_count}</span>
              </button>
              }

              {comment.user_id === currentUser && (
                <div className="flex space-x-1">
                  <button
                    onClick={() => setIsEditComment(true)}
                    className="p-1.5 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                    title="Edit"
                  >
                    <FaPencilAlt size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteComment()}
                    className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                    title="Delete"
                  >
                    <FaTrashAlt size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-2 bg-white dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
            {comment.image && (
              <div className="mt-3">
                <img
                  src={comment.image}
                  alt="Comment attachment"
                  className="rounded-lg max-h-64 object-contain border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                />
              </div>
            )}
          </div>

          { isAuthenticated && (
            <div className="mt-3 flex items-center space-x-4">
              <button
                onClick={() => {
                  setIsReply(true);
                  setReplyText("")
                }}
                className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <FaReply className="mr-1" />
                Reply
              </button>
            </div>
          )}


          { isReply && (
            <div className="mt-4 ml-6 relative">
              <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-blue-200 dark:bg-blue-700"></div>
              <div className="ml-4">
                <textarea
                  rows={2}
                  className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />

                {
                  replyImagePreview && (
                  <div className="mt-2">
                    <div className="relative inline-block">
                      <div
                        className={`relative rounded-lg overflow-hidden border-2 border-blue-400 ${
                          replyPreviewExpanded ? "w-full max-w-md" : "w-24 h-24"
                        }`}
                      >
                        <img
                          src={replyImagePreview}
                          alt="Reply attachment"
                          className={`${
                            replyPreviewExpanded ? "w-full" : "w-full h-full object-cover"
                          }`}
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500/80 transition-colors"
                          onClick={() => {
                            // Clear reply image
                          }}
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-blue-500/80 transition-colors"
                        onClick={() => setReplyPreviewExpanded(!replyPreviewExpanded)}
                      >
                        {/* Expand/collapse icon */}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <label className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
                    <FaImage />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      // onChange={onReplyImageUpload}
                    />
                  </label>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      onClick={()=>{
                        setIsReply(false);
                        setReplyText("");
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                      onClick={() => handleAddReply()}
                      disabled={!replyText.trim() && !replyImagePreview}
                    >
                      <span>Reply</span>
                      <FaPaperPlane size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {
            comment.replies &&
            comment.replies.length > 0 && (
              <div className="mt-3 flex items-center">
                <button
                  onClick={() => setExpandedReplies(!expandedReplies)}
                  className="flex items-center text-sm text-blue-500 hover:text-blue-700 transition-colors mx-6"
                >
                  {expandedReplies[comment.comment_id] ? (
                    <>
                      <FaChevronUp className="mr-2" />
                      Hide replies ({countComments(comment.replies || [])})
                    </>
                  ) : (
                    <>
                      <FaChevronDown className="mr-2" />
                      Show replies ({countComments(comment.replies || [])})
                    </>
                  )}
                </button>
              </div>
            )
          }
          {
            comment.replies &&
            comment.replies.length > 0 &&
            expandedReplies && (
              <div className="mt-4 ml-6 space-y-4 relative">
                <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-blue-200 dark:bg-blue-700"></div>
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.comment_id}
                    post={post}
                    comment={reply}
                    replyImagePreview={replyImagePreview}
                  />
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
    )}
    </>
  );
};

export default CommentItem;
