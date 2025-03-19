import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FaHeart, FaRegHeart, FaReply, FaShare, FaComment, FaEllipsisV, 
  FaCalendarAlt, FaTag, FaChevronLeft, FaTimes, FaRegSmile, 
  FaPaperPlane, FaEdit, FaFlag, FaExclamationTriangle, FaImage
} from "react-icons/fa";
import EditPostModal from "./Editpostmodal";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, AnimatePresence } from "framer-motion";

const NewsDetail = ({ onUpdatePost }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { post } = state || { post: {} };
  
  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: false
    });
  }, []);
  
  // Always allow comments (no login required)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("username") || "anonymous");
  const [isAuthor, setIsAuthor] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  // State for likes with animation
  const [postLiked, setPostLiked] = useState(() => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
    return likedPosts[post?.id]?.liked || false;
  });
  
  const [postLikeCount, setPostLikeCount] = useState(() => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
    return likedPosts[post?.id]?.likeCount || post?.likeCount || 0;
  });
  
  const [likeAnimation, setLikeAnimation] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [commentImage, setCommentImage] = useState(null);
  const [commentImagePreview, setCommentImagePreview] = useState(null);
  const [commentPreviewExpanded, setCommentPreviewExpanded] = useState(false);
  
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
    if (post?.createdBy && currentUser) {
      setIsAuthor(post.createdBy === currentUser);
    }
  }, [post, currentUser]);

  // Effect to update localStorage when likes change
  useEffect(() => {
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

  // Get default avatar
  const getDefaultAvatar = () => {
    return "https://ui-avatars.com/api/?name=You&background=0D8ABC&color=fff";
  };

  // Handle post like with animation
  const handlePostLike = (e) => {
    e.stopPropagation();
    
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 1000);
    
    if (postLiked) {
      setPostLiked(false);
      setPostLikeCount(prev => Math.max(0, prev - 1));
    } else {
      setPostLiked(true);
      setPostLikeCount(prev => prev + 1);
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
      postId: post.id,
      postTitle: post.title,
      reason: reportReason,
      description: reportDescription,
      reportedBy: currentUser,
      reportedAt: new Date().toISOString(),
      status: "pending"
    };
    
    const reports = JSON.parse(localStorage.getItem("reportedPosts") || "[]");
    reports.push(report);
    localStorage.setItem("reportedPosts", JSON.stringify(reports));
    
    setReportReason("");
    setReportDescription("");
    setShowReportModal(false);
    
    // Show confirmation with animation
    const toast = document.createElement("div");
    toast.className = "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up";
    toast.textContent = "Thank you for your report. The admin will review this post.";
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add("animate-fade-out-down");
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
  };

  // Add emoji to comment
  const addEmojiToComment = (emoji) => {
    setNewComment(prev => prev + emoji);
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
    }
  };

  // Like a comment with animation
  const handleLike = (commentId, e) => {
    e.stopPropagation();
    
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          if (comment.liked) {
            return { ...comment, liked: false, likeCount: Math.max(0, comment.likeCount - 1) };
          } else {
            return { 
              ...comment, 
              liked: true, 
              likeCount: comment.likeCount + 1,
              animateLike: true // Add animation flag
            };
          }
        }
        return comment;
      })
    );
    
    // Remove animation flag after animation completes
    setTimeout(() => {
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, animateLike: false };
          }
          return comment;
        })
      );
    }, 1000);
  };

  // Add reply to comment
  const handleAddReply = (commentId) => {
    if (newReply.trim()) {
      const now = new Date();
      const reply = {
        id: Date.now(),
        author: "You",
        avatar: getDefaultAvatar(),
        text: newReply,
        date: now.toLocaleDateString('en-US'),
        time: now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}),
      };
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment
        )
      );
      setNewReply("");
      setReplyingCommentId(null);
    }
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
      // Fallback with animation
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          const toast = document.createElement("div");
          toast.className = "fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up";
          toast.textContent = "Link copied to clipboard!";
          document.body.appendChild(toast);
          
          setTimeout(() => {
            toast.classList.add("animate-fade-out-down");
            setTimeout(() => document.body.removeChild(toast), 500);
          }, 3000);
        })
        .catch(err => console.error('Unable to copy link:', err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-indigo-500">
      {/* Main content - Navbar is provided by PublicLayout in App.js */}
      <div className="container mx-auto px-4 pt-6">
        <motion.button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-white bg-blue-600/80 backdrop-blur-sm hover:bg-blue-700 transition-colors py-2 px-4 rounded-lg shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronLeft className="mr-2" />
          Back to News
        </motion.button>
      </div>
      
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Main content card */}
        <article 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-10"
          data-aos="fade-up"
          data-aos-delay="100"
        >
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
              <div 
                className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <motion.h1 
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {post.title || "Untitled"}
                </motion.h1>
                
                <motion.div 
                  className="flex flex-wrap items-center mt-4 space-x-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
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
                </motion.div>
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Post header for when there's no featured image */}
            {(!post.images || !post.images[0]) && (
              <div className="mb-8">
                <motion.h1 
                  className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {post.title || "Untitled"}
                </motion.h1>
                
                <motion.div 
                  className="flex flex-wrap items-center space-x-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
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
                </motion.div>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex space-x-6">
                <motion.button
                  onClick={handlePostLike}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none group relative"
                  aria-label={postLiked ? "Unlike" : "Like"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    {postLiked ? (
                      <FaHeart className="text-red-500 transition-transform duration-200 group-hover:scale-110 text-xl" />
                    ) : (
                      <FaRegHeart className="transition-transform duration-200 group-hover:scale-110 text-xl" />
                    )}
                    
                    {/* Heart animation */}
                    {likeAnimation && (
                      <div className="absolute -top-1 -right-1 -left-1 -bottom-1 animate-ping">
                        <FaHeart className="text-red-500 text-xl" />
                      </div>
                    )}
                  </div>
                  <span className="font-medium">{postLikeCount}</span>
                </motion.button>
                
                <motion.button
                  onClick={() => document.getElementById('commentSection').scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors focus:outline-none"
                  aria-label="Comments"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaComment className="text-xl" />
                  <span className="font-medium">{comments.length}</span>
                </motion.button>
                
                <motion.button
                  onClick={handleShare}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors focus:outline-none"
                  aria-label="Share"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaShare className="text-xl" />
                  <span className="font-medium">Share</span>
                </motion.button>
              </div>
              
              {/* More options dropdown */}
              <div className="relative">
                <motion.button
                  className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none"
                  aria-label="More options"
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaEllipsisV />
                </motion.button>
                
                <AnimatePresence>
                  {showMoreOptions && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700 overflow-hidden"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isAuthor && (
                        <motion.button
                          onClick={() => {
                            setShowMoreOptions(false);
                            setShowEditModal(true);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          whileHover={{ x: 5 }}
                        >
                          <FaEdit className="mr-2" />
                          Edit Post
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => {
                          setShowMoreOptions(false);
                          setShowReportModal(true);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                        whileHover={{ x: 5 }}
                      >
                        <FaFlag className="mr-2" />
                        Report Post
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Post content */}
            <div 
              className="prose prose-lg max-w-none dark:prose-invert mb-12"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {post.emoji && (
                <div className="text-5xl my-4 animate-bounce">{post.emoji}</div>
              )}
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {post.content || "No content available for this post"}
              </p>
            </div>
            
            {/* Image Gallery - Enhanced with animations */}
            {Array.isArray(post.images) && post.images.length > 0 && (
              <div 
                className="mb-12"
                data-aos="fade-up"
                data-aos-delay="300"
              >
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
                      <motion.div 
                        key={index} 
                        className="relative group overflow-hidden rounded-lg shadow-md aspect-square cursor-pointer"
                        data-aos="zoom-in"
                        data-aos-delay={100 + (index * 50)}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.98 }}
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
                          <motion.button
                            className="bg-white rounded-full p-3 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(imageUrl);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6"></path>
                            </svg>
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </article>
        
        {/* Comments Section with Enhanced Design */}
        <section 
          id="commentSection" 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-2 rounded-full mr-2">
                  <FaComment />
                </span>
                Comments {comments.length > 0 && (
                  <motion.span 
                    className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm px-2 py-1 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 10 }}
                  >
                    {comments.length}
                  </motion.span>
                )}
              </h2>
            </div>
            
            {/* Enhanced Comment form with image upload */}
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
                      <motion.button
                        type="button"
                        className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                        onClick={() => setShowEmojis(!showEmojis)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaRegSmile className="text-xl" />
                      </motion.button>
                      
                      {/* Enhanced Emoji Picker with animation */}
                      <AnimatePresence>
                        {showEmojis && (
                          <motion.div 
                            className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 border border-gray-200 dark:border-gray-700 z-20 w-72"
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex flex-wrap gap-1 max-h-60 overflow-y-auto">
                              {emojiList.map((emoji, index) => (
                                <motion.button
                                  key={index}
                                  type="button"
                                  className="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors"
                                  onClick={() => addEmojiToComment(emoji)}
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {emoji}
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Image upload button */}
                    <motion.label
                      className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaImage className="text-xl" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCommentImageUpload}
                      />
                    </motion.label>
                  </div>
                  
                  <motion.button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newComment.trim() && !commentImage}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Post</span>
                    <FaPaperPlane />
                  </motion.button>
                </div>
              </div>
            </form>
            
            {/* Comments list with enhanced styling and animations */}
            {loadingComments ? (
              <div className="flex justify-center items-center py-12">
                <motion.div 
                  className="h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-8">
                {comments.map((comment, index) => (
                  <motion.div 
                    key={comment.id} 
                    className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 p-5 shadow-sm mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    data-aos="fade-up"
                    data-aos-delay={100 + (index * 50)}
                  >
                    <div className="flex">
                      <motion.img
                        className="h-10 w-10 rounded-full object-cover mr-4 ring-2 ring-blue-100 dark:ring-blue-800"
                        src={comment.avatar}
                        alt={comment.author}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getDefaultAvatar();
                        }}
                        whileHover={{ scale: 1.1 }}
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
                          
                          <motion.button
                            onClick={(e) => handleLike(comment.id, e)}
                            className="flex items-center text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <div className="relative">
                              {comment.liked ? (
                                <FaHeart className="text-red-500" />
                              ) : (
                                <FaRegHeart />
                              )}
                              
                              {/* Comment heart animation */}
                              {comment.animateLike && (
                                <motion.div 
                                  className="absolute -top-1 -right-1 -left-1 -bottom-1 text-red-500"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1.5, opacity: [1, 0] }}
                                  transition={{ duration: 0.6 }}
                                >
                                  <FaHeart />
                                </motion.div>
                              )}
                            </div>
                            <span className="ml-1 text-sm">{comment.likeCount}</span>
                          </motion.button>
                        </div>
                        
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
                        
                        <div className="mt-3 flex items-center space-x-4">
                          <motion.button
                            onClick={() => {
                              setReplyingCommentId(
                                comment.id === replyingCommentId ? null : comment.id
                              );
                            }}
                            className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaReply className="mr-1" />
                            Reply
                          </motion.button>
                        </div>

                        {/* Reply form with enhanced styling */}
                        <AnimatePresence>
                          {replyingCommentId === comment.id && (
                            <motion.div 
                              className="mt-4 ml-6 relative"
                              initial={{ opacity: 0, height: 0, y: -10 }}
                              animate={{ opacity: 1, height: "auto", y: 0 }}
                              exit={{ opacity: 0, height: 0, y: -10 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-blue-200 dark:bg-blue-700"></div>
                              <div className="ml-4">
                                <textarea
                                  rows="2"
                                  className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
                                  placeholder="Write your reply..."
                                  value={newReply}
                                  onChange={(e) => setNewReply(e.target.value)}
                                ></textarea>
                                <div className="flex justify-end mt-2 space-x-2">
                                  <motion.button
                                    type="button"
                                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    onClick={() => {
                                      setReplyingCommentId(null);
                                      setNewReply("");
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Cancel
                                  </motion.button>
                                  <motion.button
                                    type="button"
                                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                    onClick={() => handleAddReply(comment.id)}
                                    disabled={!newReply.trim()}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Reply
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Replies with enhanced styling */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 ml-6 space-y-4 relative">
                            <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-blue-200 dark:bg-blue-700"></div>
                            {comment.replies.map((reply, replyIndex) => (
                              <motion.div 
                                key={reply.id} 
                                className="ml-4 bg-blue-50 dark:bg-gray-700 p-3 rounded-lg border-l-4 border-blue-300 dark:border-blue-600"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 * replyIndex }}
                                data-aos="fade-left"
                                data-aos-delay={100 + (replyIndex * 50)}
                              >
                                <div className="flex items-start">
                                  <motion.img
                                    className="h-8 w-8 rounded-full object-cover mr-3 ring-2 ring-white dark:ring-gray-600"
                                    src={reply.avatar}
                                    alt={reply.author}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = getDefaultAvatar();
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                  />
                                  <div>
                                    <div className="flex items-center">
                                      <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {reply.author}
                                      </h4>
                                      <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {reply.date} at {reply.time}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-gray-700 dark:text-gray-300">{reply.text}</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="text-center py-12 bg-gray-50 dark:bg-gray-750 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="bg-white dark:bg-gray-700 inline-flex rounded-full p-4 mb-4 shadow-md"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <FaComment className="text-3xl text-blue-400 dark:text-blue-300" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No comments yet</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Be the first to comment on this post
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </div>

      {/* Image Viewer Modal with enhanced controls */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button 
              className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors z-50 p-2 bg-black/30 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes className="text-2xl" />
            </motion.button>
            
            <motion.div 
              className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Post Modal */}
      <AnimatePresence>
        {showEditModal && (
          <EditPostModal 
            post={post} 
            onClose={() => setShowEditModal(false)} 
            onSave={handleUpdatePost} 
          />
        )}
      </AnimatePresence>

      {/* Report Post Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <FaFlag className="mr-2 text-red-500" />
                    Report Post
                  </h3>
                  <motion.button
                    onClick={() => setShowReportModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes />
                  </motion.button>
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
                    <option value="inappropriate">Inappropriate content</option>
                    <option value="misinformation">Misinformation</option>
                    <option value="spam">Spam or advertising</option>
                    <option value="duplicate">Duplicate post</option>
                    <option value="offensive">Offensive language</option>
                    <option value="other">Other reason</option>
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
                  <motion.button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleReportSubmit}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    disabled={!reportReason}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaFlag className="mr-2" />
                    Submit Report
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add the CSS animations */}
      <style jsx="true">{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-out-down {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(20px);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
        
        .animate-fade-out-down {
          animation: fade-out-down 0.4s ease-in forwards;
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsDetail;