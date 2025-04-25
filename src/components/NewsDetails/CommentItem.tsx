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
import { Comment, Post } from '../../models/postType';

interface CommentItemProps {
  post: Post;
  comment: Comment;
  currentUser: string;
  replyingCommentId: string | null;
  newReply: string;
  setNewReply: (text: string) => void;
  onAddReply: (commentId: string) => void;
  replyImagePreview: string | null;
  onReplyImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelReply: () => void;
  expandedReplies: Record<string, boolean>;
  onToggleReplies: (commentId: string) => void;
  editingReplyId: string | null;
  editReplyText: string;
  setEditReplyText: (text: string) => void;
  setEditingReplyId: (text: string) => void;
  onSaveEditReply: (commentId: string, replyId: string) => void;
  onEditReply: (commentId: string, replyId: string) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
  onReplyLike: (commentId: string, replyId: string, e: React.MouseEvent) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  post,
  comment,
  currentUser,
  replyingCommentId,
  newReply,
  setNewReply,
  onAddReply,
  replyImagePreview,
  onReplyImageUpload,
  onCancelReply,
  expandedReplies,
  onToggleReplies,
  editingReplyId,
  editReplyText,
  setEditReplyText,
  setEditingReplyId,
  onSaveEditReply,
  onEditReply,
  onDeleteReply,
  onReplyLike,
}) => {
  const isCommentAuthor = currentUser === comment.author
  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.comment_id !== commentId));
    removecommentPostMutation.mutate({
      post_id: post?.post_id || "",
      comment_id: commentId,
    });
  };

  const handleEditComment = (commentId: string) => {
    const comment = comments.find(c => c.comment_id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditCommentText(comment.text);
    }
  };

  const handleConfirmEditComment = (commentId: string) => {
    if (editCommentText.trim()) {
      setComments(prev =>
        prev.map(comment =>
          comment.comment_id === commentId
            ? { ...comment, text: editCommentText }
            : comment
        )
      );
      setEditingCommentId(null);

      editcommentPostMutation.mutate({
        post_id: post?.post_id || "",
        comment_id: commentId,
        comment: editCommentText,
      });
    }
  };

  const handleLikeComment = (commentId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    setComments(prev =>
      prev.map(comment =>
        comment.comment_id === commentId
          ? {
              ...comment,
              liked: !comment.liked,
              likeCount: comment.liked
                ? Math.max(0, comment.likeCount - 1)
                : comment.likeCount + 1,
            }
          : comment
      )
    );

    const comment = comments.find(c => c.comment_id === commentId);
    if (comment?.liked) {
      removelikecommentPostMutation.mutate({post_id: "", comment_id: commentId });
    } else {
      likecommentPostMutation.mutate({post_id: "", comment_id: commentId });
    }
  };

  const handleAddReply = (commentId: string) => {
    if (newReply.trim() || replyImage) {
      const now = new Date();
      const reply = {
        comment_id: "",
        author: "You",
        avatar: "https://ui-avatars.com/api/?name=You&background=0D8ABC&color=fff",
        text: newReply,
        date: now.toLocaleDateString("en-US"),
        time: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        liked: false,
        likeCount: 0,
        image: replyImagePreview,
      };

      replycommentPostMutation.mutate({
          post_id: post.post_id,
          comment_id: commentId,
          comment: newComment,
          reply: newReply,
        }, {
          onSuccess: (res) => {
            const data = res.data
            setComments(prev =>
              prev.map(comment =>
                comment.comment_id === commentId
                  ? { ...comment, replies: [...(comment.replies || []), reply] }
                  : comment
              )
            );
            setNewReply("");
            setReplyImage(null);
            setReplyImagePreview(null);
            setReplyingCommentId(null);
          }
        }
      );
    }
  };





  const handleEditReply = (commentId: string, replyId: string) => {
    const comment = comments.find(c => c.comment_id === commentId);
    if (comment) {
      const reply = (comment.replies || []).find(r => r.comment_id === replyId);
      if (reply) {
        setEditingReplyId(replyId);
        setEditReplyText(reply.text);
      }
    }
  };

  const handleSaveEditReply = (commentId: string, replyId: string) => {
    if (editReplyText.trim()) {
      setComments(prev =>
        prev.map(comment => {
          if (comment.comment_id === commentId) {
            return {
              ...comment,
              replies:(comment.replies || []).map(reply =>
                reply.comment_id === replyId ? { ...reply, text: editReplyText } : reply
              ),
            };
          }
          return comment;
        })
      );
      setEditingReplyId(null);

      editcommentPostMutation.mutate({
        post_id: post?.post_id || "",
        comment_id: replyId,
        comment: editReplyText,
      });
    }
  };
  const [replyPreviewExpanded, setReplyPreviewExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 p-5 shadow-sm mb-6">
      <div className="flex">
        // Avartar Image
        <img
          className="h-10 w-10 rounded-full object-cover mr-4 ring-2 ring-blue-100 dark:ring-blue-800"
          src={comment.profile_picture}
          alt={comment.username}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://ui-avatars.com/api/?name=You&background=0D8ABC&color=fff';
          }}
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {comment.fullname} {comment.username}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {comment.date} at {comment.time}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              // LIKE COMMENT
              {
              // <button
              //   onClick={(e) => handleLikeComment(comment.comment_id, e)}
              //   className="flex items-center text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              // >
              //   <div className="relative">
              //     {comment.liked ? (
              //       <FaHeart className="text-red-500" />
              //     ) : (
              //       <FaRegHeart />
              //     )}
              //   </div>
              //   <span className="ml-1 text-sm">{comment.like_count}</span>
              // </button>
              }

              {comment.user_id === currentUser && (
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditComment(comment.comment_id)}
                    className="p-1.5 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                    title="Edit"
                  >
                    <FaPencilAlt size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.comment_id)}
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

          <div className="mt-3 flex items-center space-x-4">
            <button
              onClick={() => handleAddReply(comment.comment_id)}
              className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <FaReply className="mr-1" />
              Reply
            </button>
          </div>

          {replyingCommentId === comment.comment_id && (
            <div className="mt-4 ml-6 relative">
              <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-blue-200 dark:bg-blue-700"></div>
              <div className="ml-4">
                <textarea
                  rows={2}
                  className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
                  placeholder="Write your reply..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
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
                      onChange={onReplyImageUpload}
                    />
                  </label>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      onClick={onCancelReply}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                      onClick={() => onAddReply(comment.comment_id)}
                      disabled={!newReply.trim() && !replyImagePreview}
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
                  onClick={() => onToggleReplies(comment.comment_id)}
                  className="flex items-center text-sm text-blue-500 hover:text-blue-700 transition-colors mx-6"
                >
                  {expandedReplies[comment.comment_id] ? (
                    <>
                      <FaChevronUp className="mr-2" />
                      Hide replies ({comment.replies.length})
                    </>
                  ) : (
                    <>
                      <FaChevronDown className="mr-2" />
                      Show replies ({comment.replies.length})
                    </>
                  )}
                </button>
              </div>
            )
          }

          {
            comment.replies &&
            comment.replies.length > 0 &&
            expandedReplies[comment.comment_id] && (
              <div className="mt-4 ml-6 space-y-4 relative">
                <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-blue-200 dark:bg-blue-700"></div>
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.comment_id}
                    post={post}
                    comment={reply}
                    currentUser={currentUser}
                    replyingCommentId={replyingCommentId}
                    newReply={newReply}
                    setNewReply={setNewReply}
                    onAddReply={onAddReply}
                    replyImagePreview={replyImagePreview}
                    onReplyImageUpload={onReplyImageUpload}
                    onCancelReply={onCancelReply}
                    expandedReplies={expandedReplies}
                    onToggleReplies={onToggleReplies}
                    editingReplyId={editingReplyId}
                    editReplyText={editReplyText}
                    setEditReplyText={setEditReplyText}
                    setEditingReplyId={setEditingReplyId}
                    onSaveEditReply={onSaveEditReply}
                    onEditReply={onEditReply}
                    onDeleteReply={onDeleteReply}
                    onReplyLike={onReplyLike}
                  />
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
