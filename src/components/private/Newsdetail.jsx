import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FaHeart, FaRegHeart, FaReply, FaShare, FaComment, FaEllipsisV, 
  FaCalendarAlt, FaTag, FaChevronLeft, FaTimes, FaRegSmile, 
  FaPaperPlane, FaEdit, FaFlag, FaExclamationTriangle, FaImage,
  FaTrashAlt, FaPencilAlt
} from "react-icons/fa";
import EditPostModal from "./Editpostmodal";
import { useCommentPost, useEditCommentPost, useGetPostById, useLikeCommentPost, useLikePost, useRemoveLikePost, useReplyCommentPost, useReportPostForm } from "../../api/post";

const NewsDetail = ({ onUpdatePost }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState({});

  // Always allow comments (no login required)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("user_id") || "anonymous");
  const [isAuthor, setIsAuthor] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const likePostMutation = useLikePost();
  const removelikePostMutation = useRemoveLikePost();
  
  // State for likes
  const [postLiked, setPostLiked] = useState(() => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
    return likedPosts[post?.id]?.liked || false;
  });
  
  const [postLikeCount, setPostLikeCount] = useState();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [replyImagePreview, setReplyImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [commentImage, setCommentImage] = useState(null);
  const [commentImagePreview, setCommentImagePreview] = useState(null);
  const [commentPreviewExpanded, setCommentPreviewExpanded] = useState(false);
  const [replyPreviewExpanded, setReplyPreviewExpanded] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editReplyText, setEditReplyText] = useState("");

  const getPostBid = useGetPostById();
  const reportPostMutation = useReportPostForm();
  const commentPostMutation = useCommentPost();
  const replycommentPostMutation = useReplyCommentPost();
  // const editcommentPostMutation = useEditCommentPost();
  // const likecommentPostMutation = useLikeCommentParams();
  // const removelikecommentPostMutation = useLikeCommentParams();
  // const uploadPostMutation = useUpload();
  
  
  // Expanded emoji list for comment section
  const emojiList = [
    "😊", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😍", "🥰", 
    "😘", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", 
    "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", 
    "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "😵",
    "👍", "👎", "👏", "🙌", "👐", "🤝", "🙏", "✌️", "🤞", "🤟", 
    "🤘", "👌", "👈", "👉", "👆", "👇", "💪", "🙋", "🤦", "🤷",
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "💔", "❣️", "💕", 
    "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️", "💯", "💢",
    "🎉", "🎊", "🎈", "🎂", "🎁", "🎗️", "🏆", "🏅", "🎖️", "🥇", 
    "🔥", "⭐", "🌟", "✨", "💫", "⚡", "☀️", "🌈", "☃️", "⛄"
  ];

  // Check if current user is the author of the post
  useEffect(() => {
    console.log("user_id", post?.author_user_id, "currentUser", currentUser);
    if (post?.author_user_id && currentUser) {
      setIsAuthor(post.author_user_id === currentUser);
    }
  }, [post, currentUser]);
  useEffect(() => {
    getPostBid.mutate(state.post?.post_id, {
      onSuccess: (res) => {
        console.log(res);
        setPost(res.data);
        setPostLikeCount(res.data.likes_count);
        
        if (res.data.comments && Array.isArray(res.data.comments)) {
          const formattedComments = res.data.comments.map(comment => {
            let formattedReplies = [];         
            if (comment.replies && Array.isArray(comment.replies)) {
              formattedReplies = comment.replies.map(reply => {
                return {
                  id: reply.comment_id, 
                  author: reply.commenter_name || "Anonymous",
                  avatar: "https://ui-avatars.com/api/?name=" + (reply.commenter_name || "User"),
                  text: reply.content || "", 
                  date: new Date(reply.created_timestamp * 1000).toLocaleDateString('en-US'),
                  time: new Date(reply.created_timestamp * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}),
                  liked: false,
                  likeCount: reply.likes_count || 0,
                  image: reply.media_urls || null 
                };
              });
            }
            return {
              id: comment.comment_id,
              author: comment.commenter_name || "Anonymous",
              avatar: "https://ui-avatars.com/api/?name=" + (comment.commenter_name || "User"),
              text: comment.content || "",
              date: new Date(comment.created_timestamp * 1000).toLocaleDateString('en-US'),
              time: new Date(comment.created_timestamp * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}),
              replies: formattedReplies, 
              liked: false,
              likeCount: comment.likes_count || 0,
              image: comment.media_urls || null
            };
          });          
          setComments(formattedComments);
          setLoadingComments(false);
        }
      },
      onError: (err) => {
        console.error("Error loading post:", err);
        setLoadingComments(false);
      }
    });
  }, []);

  // Effect to update localStorage when likes change
  useEffect(() => {
    console.log("post_id", post?.id);
    if (post?.id) {
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
      likedPosts[post.id] = { liked: postLiked, likeCount: postLikeCount };
      localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
    }
  }, [postLiked, postLikeCount, post?.id]);

  // Handle image upload for comments
  const handleCommentImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCommentImage(file);
      setCommentImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle image upload for replies
  const handleReplyImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReplyImage(file);
      setReplyImagePreview(URL.createObjectURL(file));
    }
  };

  // Get default avatar
  const getDefaultAvatar = () => {
    return "https://ui-avatars.com/api/?name=You&background=0D8ABC&color=fff";
  };

  const handlePostLike = (e) => {
    e.stopPropagation();
    
    if (postLiked) {
      setPostLiked(false);
      setPostLikeCount(prev => Math.max(0, prev - 1));
      removelikePostMutation.mutate(post.post_id, {
        onSuccess: (res) => {
          console.log(res);
        },
        onError: (err) => {
          console.log(err);
        }
      });
    } else {
      setPostLiked(true);
      setPostLikeCount(prev => prev + 1);
      likePostMutation.mutate(post.post_id, {
        onSuccess: (res) => {
          console.log(res);
        },
        onError: (err) => {
          console.log(err);
        }
      });
    }
  };

  // Handle updating post
  const handleUpdatePost = (updatedPost) => {
    console.log("Saving updated post:", updatedPost);
    
    if (onUpdatePost && typeof onUpdatePost === 'function') {
      onUpdatePost(updatedPost);
      setShowEditModal(false);
      navigate(`/newsdetail`, { state: { post: updatedPost }, replace: true });
    } else {
      console.error("onUpdatePost is not a function or not provided");
      setShowEditModal(false);
      navigate(`/newsdetail`, { state: { post: updatedPost }, replace: true });
    }
  };

  // Handle report submission
  const handleReportSubmit = () => {
    if (!reportReason) {
      alert("Please select a reason for reporting");
      return;
    }
    
    const report = {
      id: post.id,
      type: "post",
      category: reportReason,
      additional: reportDescription
    };
    
    reportPostMutation.mutate(report, {
      onSuccess: (res) => {
        console.log(res);
      }
    });
    
    setReportReason("");
    setReportDescription("");
    setShowReportModal(false);
    
    // Show confirmation
    const toast = document.createElement("div");
    toast.className = "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
    toast.textContent = "Thank you for your report. The admin will review this post.";
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  // Add emoji to comment
  const addEmojiToComment = (emoji) => {
    setNewComment(prev => prev + emoji);
  };

  // Add emoji to reply
  const addEmojiToReply = (emoji) => {
    setNewReply(prev => prev + emoji);
  };

  // Add new comment
  const handleAddComment = () => {
    if (newComment.trim() || commentImage) {
      const now = new Date();
      const newCommentObj = {
        id: Date.now(),
        author: "You",
        avatar: getDefaultAvatar(),
        text: newComment,
        date: now.toLocaleDateString('en-US'),
        time: now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}),
        replies: [],
        liked: false,
        likeCount: 0,
        image: commentImagePreview
      };
      setComments([newCommentObj, ...comments]);
      setNewComment("");
      setShowEmojis(false);
      setCommentImage(null);
      setCommentImagePreview(null);

      commentPostMutation.mutate({
      post_id: post.post_id, 
      comment: newComment
      }, {
        onSuccess: (res) => {
          console.log(res);
        },
        onError: (err) => {
          console.log(err);
        }
      });
    }
  };

  // Like a comment
  const handleLike = (commentId, e) => {
    e.stopPropagation();
    
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          if (comment.liked) {
            return { ...comment, liked: false, likeCount: Math.max(0, comment.likeCount - 1) };
          } else {
            return { ...comment, liked: true, likeCount: comment.likeCount + 1 };
          }
        }
        return comment;
      })
    );
  };

  // Add reply to comment
  const handleAddReply = (commentId) => {
    if (newReply.trim() || replyImage) {
      const now = new Date();
      const reply = {
        id: Date.now(),
        author: "You",
        avatar: getDefaultAvatar(),
        text: newReply,
        date: now.toLocaleDateString('en-US'),
        time: now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}),
        liked: false,
        likeCount: 0,
        image: replyImagePreview
      };
      
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment
        )
      );
      
      setNewReply("");
      setReplyImage(null);
      setReplyImagePreview(null);
      setReplyingCommentId(null);
  
      // // ส่งข้อมูลตามรูปแบบ ReplyCommentOnPostForm
      // replycommentPostMutation.mutate({
      //   post_id: post.post_id,
      //   comment_id: commentId,     
      //   reply: newReply           
      // }, {
      //   onSuccess: (res) => {
      //     console.log(res);
      //   },
      //   onError: (err) => {
      //     console.log(err);
      //   }
      // });
    }
  };
  // Delete a comment
  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
    
    // Show confirmation toast
    const toast = document.createElement("div");
    toast.className = "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
    toast.textContent = "Comment deleted successfully";
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  // Edit a comment
  const handleEditComment = (commentId) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditCommentText(comment.text);
    }

    // editcommentPostMutation.mutate({ 
    //  // comment:         
    // }, {
    //   onSuccess: (res) => {
    //     console.log(res);
    //   },
    //   onError: (err) => {
    //     console.log(err);
    //   }
    // });

  };


  // Save edited comment
  const handleSaveEditComment = (commentId) => {
    if (editCommentText.trim()) {
      setComments(
        comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, text: editCommentText }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditCommentText("");
      
      // Show confirmation toast
      const toast = document.createElement("div");
      toast.className = "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      toast.textContent = "Comment updated successfully";
      document.body.appendChild(toast);
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    }
  };

  // Delete a reply
  const handleDeleteReply = (commentId, replyId) => {
    setComments(
      comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.filter(reply => reply.id !== replyId)
          };
        }
        return comment;
      })
    );
    
    // Show confirmation toast
    const toast = document.createElement("div");
    toast.className = "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
    toast.textContent = "Reply deleted successfully";
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  // Edit a reply
  const handleEditReply = (commentId, replyId) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      const reply = comment.replies.find(r => r.id === replyId);
      if (reply) {
        setEditingReplyId(replyId);
        setEditReplyText(reply.text);
      }
    }

   editcommentPostMutation.mutate({
      post_id: post.post_id,
      comment_id: commentId,     
      reply: newReply           
    }, {
      onSuccess: (res) => {
        console.log(res);
      },
      onError: (err) => {
        console.log(err);
      }
    });
  };

  // Save edited reply
  const handleSaveEditReply = (commentId, replyId) => {
    if (editReplyText.trim()) {
      setComments(
        comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === replyId 
                  ? { ...reply, text: editReplyText } 
                  : reply
              )
            };
          }
          return comment;
        })
      );
      setEditingReplyId(null);
      setEditReplyText("");
      
      // Show confirmation toast
      const toast = document.createElement("div");
      toast.className = "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      toast.textContent = "Reply updated successfully";
      document.body.appendChild(toast);
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    }
  };

  // Like a reply
  const handleReplyLike = (commentId, replyId, e) => {
    e.stopPropagation();    
    setComments(
      comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === replyId) {
                if (reply.liked) {
                  return { ...reply, liked: false, likeCount: Math.max(0, reply.likeCount - 1) };
                } else {
                  return { ...reply, liked: true, likeCount: reply.likeCount + 1 };
                }
              }
              return reply;
            })
          };
        }
        return comment;
      })
    );
    likecommentPostMutation.mutate({
               
    }, {
      onSuccess: (res) => {
        console.log(res);
      },
      onError: (err) => {
        console.log(err);
      }
    });
  };
    
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        // Assuming DD/MM/YYYY format
        const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric'
        });
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  // Share post
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          const toast = document.createElement("div");
          toast.className = "fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
          toast.textContent = "Link copied to clipboard!";
          document.body.appendChild(toast);
          
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 3000);
        })
        .catch(err => console.error('Unable to copy link:', err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-indigo-500">
      {/* Main content - Navbar is provided by PublicLayout in App.js */}
      <div className="container mx-auto px-4 pt-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-white bg-blue-600/80 backdrop-blur-sm hover:bg-blue-700 transition-colors py-2 px-4 rounded-lg shadow-md"
        >
          <FaChevronLeft className="mr-2" />
          Back to News
        </button>
      </div>
      
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Main content card */}
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-10">
          {/* Featured image */}
          {post.images && post.images[0] && (
            <div className="relative h-72 md:h-96 overflow-hidden">
              <img
                src={post.images[0] instanceof File ? URL.createObjectURL(post.images[0]) : post.images[0]}
                alt={post.title || "Main image"}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/800x600?text=Image Not Found";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                  {post.title || "Untitled"}
                </h1>
                
                <div className="flex flex-wrap items-center mt-4 space-x-4">
                  {post.category && (
                    <span className="flex items-center text-sm text-blue-100 bg-blue-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
                      <FaTag className="mr-1" />
                      {post.category}
                    </span>
                  )}
                  
                  {(post.startDate || post.endDate) && (
                    <span className="flex items-center text-sm text-blue-100 bg-blue-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
                      <FaCalendarAlt className="mr-1" />
                      {post.startDate && formatDate(post.startDate)}
                      {post.startDate && post.endDate && " - "}
                      {post.endDate && formatDate(post.endDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Post header for when there's no featured image */}
            {(!post.images || !post.images[0]) && (
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                  {post.title || "Untitled"}
                </h1>
                
                <div className="flex flex-wrap items-center space-x-4">
                  {post.category && (
                    <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      <FaTag className="mr-1" />
                      {post.category}
                    </span>
                  )}
                  
                  {(post.startDate || post.endDate) && (
                    <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      <FaCalendarAlt className="mr-1" />
                      {post.startDate && formatDate(post.startDate)}
                      {post.startDate && post.endDate && " - "}
                      {post.endDate && formatDate(post.endDate)}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex space-x-6">
                <button
                  onClick={handlePostLike}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none group relative"
                  aria-label={postLiked ? "Unlike" : "Like"}
                >
                  <div className="relative">
                    {postLiked ? (
                      <FaHeart className="text-red-500 text-xl" />
                    ) : (
                      <FaRegHeart className="text-xl" />
                    )}
                  </div>
                  <span className="font-medium">{postLikeCount}</span>
                </button>
                
                <button
                  onClick={() => document.getElementById('commentSection').scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors focus:outline-none"
                  aria-label="Comments"
                >
                  <FaComment className="text-xl" />
                  <span className="font-medium">{comments.length}</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors focus:outline-none"
                  aria-label="Share"
                >
                  <FaShare className="text-xl" />
                  <span className="font-medium">Share</span>
                </button>
              </div>
              
              {/* More options dropdown */}
              <div className="relative">
                <button
                  className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none"
                  aria-label="More options"
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                >
                  <FaEllipsisV />
                </button>
                
                {showMoreOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {isAuthor && (
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
            </div>
            
            {/* Post content */}
            <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
              {post.emoji && (
                <div className="text-5xl my-4">{post.emoji}</div>
              )}
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {post.content || "No content available for this post"}
              </p>
            </div>
            
            {/* Image Gallery */}
            {Array.isArray(post.images) && post.images.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-2 rounded-full mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  Gallery
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {post.images.map((image, index) => {
                    const imageUrl = image instanceof File ? URL.createObjectURL(image) : image;
                    return (
                      <div 
                        key={index} 
                        className="relative group overflow-hidden rounded-lg shadow-md aspect-square cursor-pointer"
                      >
                        <img
                          src={imageUrl}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onClick={() => setSelectedImage(imageUrl)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/400x400?text=Image Not Found";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button
                            className="bg-white rounded-full p-3 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(imageUrl);
                            }}
                          >
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </article>
        
        {/* Comments Section */}
        <section 
          id="commentSection" 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-2 rounded-full mr-2">
                  <FaComment />
                </span>
                Comments {comments.length > 0 && (
                  <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm px-2 py-1 rounded-full">
                    {comments.length}
                  </span>
                )}
              </h2>
            </div>
            
            {/* Comment form with image upload */}
            <form 
              className="mb-8"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddComment();
              }}
            >
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md mb-3">
                <textarea
                  rows="3"
                  className="w-full bg-transparent p-4 text-gray-700 dark:text-gray-200 resize-none focus:outline-none"
                  placeholder="Add your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                
                {/* Comment image preview */}
                {commentImagePreview && (
                  <div className="px-4 pb-2">
                    <div className="relative inline-block">
                      <div 
                        className={`relative rounded-lg overflow-hidden border-2 border-blue-400 ${
                          commentPreviewExpanded ? "w-full max-w-lg" : "w-32 h-32"
                        }`}
                      >
                        <img 
                          src={commentImagePreview} 
                          alt="Comment attachment"
                          className={`${
                            commentPreviewExpanded ? "w-full" : "w-full h-full object-cover"
                          }`}
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500/80 transition-colors"
                          onClick={() => {
                            setCommentImage(null);
                            setCommentImagePreview(null);
                          }}
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-blue-500/80 transition-colors"
                        onClick={() => setCommentPreviewExpanded(!commentPreviewExpanded)}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          {commentPreviewExpanded ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6m0 0v6m0-6L14 9M9 21H3m0 0v-6m0 6l7-7" />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                        onClick={() => setShowEmojis(!showEmojis)}
                      >
                        <FaRegSmile className="text-xl" />
                      </button>
                      
                      {/* Emoji Picker */}
                      {showEmojis && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 border border-gray-200 dark:border-gray-700 z-20 w-72">
                          <div className="flex flex-wrap gap-1 max-h-60 overflow-y-auto">
                            {emojiList.map((emoji, index) => (
                              <button
                                key={index}
                                type="button"
                                className="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors"
                                onClick={() => addEmojiToComment(emoji)}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Image upload button */}
                    <label
                      className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      <FaImage className="text-xl" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCommentImageUpload}
                      />
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newComment.trim() && !commentImage}
                  >
                    <span>Post</span>
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </form>
            
            {/* Comments list */}
            {loadingComments ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-8">
                {comments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 p-5 shadow-sm mb-6"
                  >
                    <div className="flex">
                      <img
                        className="h-10 w-10 rounded-full object-cover mr-4 ring-2 ring-blue-100 dark:ring-blue-800"
                        src={comment.avatar}
                        alt={comment.author}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getDefaultAvatar();
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {comment.author}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {comment.date} at {comment.time}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => handleLike(comment.id, e)}
                              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              <div className="relative">
                                {comment.liked ? (
                                  <FaHeart className="text-red-500" />
                                ) : (
                                  <FaRegHeart />
                                )}
                              </div>
                              <span className="ml-1 text-sm">{comment.likeCount}</span>
                            </button>
                            
                            {/* Edit and Delete buttons for user's own comments */}
                            {comment.author === "You" && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleEditComment(comment.id)}
                                  className="p-1.5 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                                  title="Edit"
                                >
                                  <FaPencilAlt size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                                  title="Delete"
                                >
                                  <FaTrashAlt size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Comment content - normal or editing mode */}
                        {editingCommentId === comment.id ? (
                          <div className="mt-2">
                            <textarea
                              className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
                              rows="3"
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                            ></textarea>
                            <div className="flex justify-end mt-2 space-x-2">
                              <button
                                type="button"
                                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditCommentText("");
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                onClick={() => handleSaveEditComment(comment.id)}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                            
                            {/* Comment image */}
                            {comment.image && (
                              <div className="mt-3">
                                <img 
                                  src={comment.image} 
                                  alt="Comment attachment" 
                                  className="rounded-lg max-h-64 object-contain border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => setSelectedImage(comment.image)}
                                />
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Comment actions */}
                        {editingCommentId !== comment.id && (
                          <div className="mt-3 flex items-center space-x-4">
                            <button
                              onClick={() => {
                                setReplyingCommentId(
                                  comment.id === replyingCommentId ? null : comment.id
                                );
                                setReplyImage(null);
                                setReplyImagePreview(null);
                              }}
                              className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                            >
                              <FaReply className="mr-1" />
                              Reply
                            </button>
                          </div>
                        )}

                        {/* Reply form */}
                        {replyingCommentId === comment.id && (
                          <div className="mt-4 ml-6 relative">
                            <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-blue-200 dark:bg-blue-700"></div>
                            <div className="ml-4">
                              <textarea
                                rows="2"
                                className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
                                placeholder="Write your reply..."
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                              ></textarea>
                              
                              {/* Reply image preview */}
                              {replyImagePreview && (
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
                                          setReplyImage(null);
                                          setReplyImagePreview(null);
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
                                      <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-3 w-3" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                      >
                                        {replyPreviewExpanded ? (
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                        ) : (
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6m0 0v6m0-6L14 9M9 21H3m0 0v-6m0 6l7-7" />
                                        )}
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between mt-2">
                                {/* Image upload for reply */}
                                <label className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
                                  <FaImage />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleReplyImageUpload}
                                  />
                                </label>
                                
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    onClick={() => {
                                      setReplyingCommentId(null);
                                      setNewReply("");
                                      setReplyImage(null);
                                      setReplyImagePreview(null);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                                    onClick={() => handleAddReply(comment.id)}
                                    disabled={!newReply.trim() && !replyImage}
                                  >
                                    <span>Reply</span>
                                    <FaPaperPlane size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 ml-6 space-y-4 relative">
                            <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-blue-200 dark:bg-blue-700"></div>
                            {comment.replies.map((reply) => (
                              <div 
                                key={reply.id} 
                                className="ml-4 bg-blue-50 dark:bg-gray-700 p-3 rounded-lg border-l-4 border-blue-300 dark:border-blue-600"
                              >
                                <div className="flex items-start">
                                  <img
                                    className="h-8 w-8 rounded-full object-cover mr-3 ring-2 ring-white dark:ring-gray-600"
                                    src={reply.avatar}
                                    alt={reply.author}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = getDefaultAvatar();
                                    }}
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                          {reply.author}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {reply.date} at {reply.time}
                                        </p>
                                      </div>
                                      
                                      {/* Reply actions */}
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={(e) => handleReplyLike(comment.id, reply.id, e)}
                                          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                        >
                                          {reply.liked ? (
                                            <FaHeart className="text-red-500" size={12} />
                                          ) : (
                                            <FaRegHeart size={12} />
                                          )}
                                          <span className="ml-1 text-xs">{reply.likeCount}</span>
                                        </button>
                                        
                                        {/* Edit and Delete buttons for user's own replies */}
                                        {reply.author === "You" && (
                                          <div className="flex space-x-1">
                                            <button
                                              onClick={() => handleEditReply(comment.id, reply.id)}
                                              className="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                                              title="Edit"
                                            >
                                              <FaPencilAlt size={10} />
                                            </button>
                                            <button
                                              onClick={() => handleDeleteReply(comment.id, reply.id)}
                                              className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                                              title="Delete"
                                            >
                                              <FaTrashAlt size={10} />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Reply content - normal or editing mode */}
                                    {editingReplyId === reply.id ? (
                                      <div className="mt-2">
                                        <textarea
                                          className="w-full p-2 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm text-sm"
                                          rows="2"
                                          value={editReplyText}
                                          onChange={(e) => setEditReplyText(e.target.value)}
                                        ></textarea>
                                        <div className="flex justify-end mt-2 space-x-2">
                                          <button
                                            type="button"
                                            className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                            onClick={() => {
                                              setEditingReplyId(null);
                                              setEditReplyText("");
                                            }}
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            type="button"
                                            className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                            onClick={() => handleSaveEditReply(comment.id, reply.id)}
                                          >
                                            Save
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300">{reply.text}</p>
                                        
                                        {/* Reply image */}
                                        {reply.image && (
                                          <div className="mt-2">
                                            <img 
                                              src={reply.image} 
                                              alt="Reply attachment" 
                                              className="rounded-lg max-h-48 object-contain border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                                              onClick={() => setSelectedImage(reply.image)}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-750 rounded-xl">
                <div className="bg-white dark:bg-gray-700 inline-flex rounded-full p-4 mb-4 shadow-md">
                  <FaComment className="text-3xl text-blue-400 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No comments yet</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Be the first to comment on this post
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors z-50 p-2 bg-black/30 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <FaTimes className="text-2xl" />
          </button>
          
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/800x600?text=Image Not Found";
              }}
            />
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditModal && (     
        <EditPostModal 
          post={post} 
          onClose={() => setShowEditModal(false)} 
          onSave={handleUpdatePost} 
        />
      )}

      {/* Report Post Modal */}
      {showReportModal && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <FaFlag className="mr-2 text-red-500" />
                  Report Post
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4 flex items-start">
                <FaExclamationTriangle className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                <p className="text-sm text-red-800 dark:text-red-300">
                  Reports are sent to administrators for review. Abuse of the reporting system may result in restrictions.
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Reason for reporting <span className="text-red-500">*</span>
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="spam">Spam content</option>
                  <option value="harassment">Harassment</option>
                  <option value="hate_speech">Hate speech</option>
                  <option value="misinformation">Misinformation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Additional details <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Please provide more information about the issue..."
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReportSubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  disabled={!reportReason}
                >
                  <FaFlag className="mr-2" />
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetail;