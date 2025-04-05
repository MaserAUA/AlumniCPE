// src/hooks/usePostData.js
import { useState, useEffect, useCallback } from 'react';
import { postService } from '../components/private/api/postService';

/**
 * Custom hook for fetching post data
 * @param {Object} options - Filter options for posts
 * @returns {Object} - Post data, loading state, error state, and refetch function
 */
export const usePosts = (options = {}) => {
  const [data, setData] = useState({ posts: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to fetch posts with filters
  const fetchPosts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Merge options with filters
      const mergedFilters = { ...options, ...filters };
      
      const response = await postService.getPosts(mergedFilters);
      setData(response);
      
      return response;
    } catch (err) {
      setError(err);
      return { posts: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, [options]);
  
  // Initial fetch on mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  return {
    data,
    loading,
    error,
    refetch: fetchPosts
  };
};

/**
 * Custom hook for fetching a single post by ID
 * @param {String} postId - ID of the post to fetch
 * @returns {Object} - Post data, loading state, error state, and refetch function
 */
export const usePostDetail = (postId) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to fetch a single post
  const fetchPost = useCallback(async (id = postId) => {
    if (!id) {
      setLoading(false);
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await postService.getPostById(id);
      setPost(response);
      
      return response;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [postId]);
  
  // Initial fetch on mount or when postId changes
  useEffect(() => {
    fetchPost();
  }, [fetchPost]);
  
  return {
    post,
    loading,
    error,
    refetch: fetchPost
  };
};

/**
 * Custom hook for managing post comments
 * @param {String} postId - ID of the post to fetch comments for
 * @returns {Object} - Comments data, loading state, error state, and functions
 */
export const usePostComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to fetch comments
  const fetchComments = useCallback(async () => {
    if (!postId) {
      setLoading(false);
      return [];
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await postService.getComments(postId);
      setComments(response);
      
      return response;
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [postId]);
  
  // Function to add a comment
  const addComment = useCallback(async (commentData) => {
    try {
      setLoading(true);
      const response = await postService.addComment(postId, commentData);
      
      // Refresh comments after adding
      await fetchComments();
      
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [postId, fetchComments]);
  
  // Function to reply to a comment
  const replyToComment = useCallback(async (commentId, replyData) => {
    try {
      setLoading(true);
      const response = await postService.replyToComment(commentId, replyData);
      
      // Refresh comments after replying
      await fetchComments();
      
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchComments]);
  
  // Initial fetch on mount or when postId changes
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);
  
  return {
    comments,
    loading,
    error,
    refetch: fetchComments,
    addComment,
    replyToComment
  };
};

/**
 * Custom hook for managing post likes
 * @param {String} postId - ID of the post to manage likes for
 * @returns {Object} - Like state and like toggle function
 */
export const usePostLikes = (postId) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Fetch initial like status
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!postId) return;
      
      try {
        const post = await postService.getPostById(postId);
        if (post) {
          setLiked(post.userHasLiked || false);
          setLikeCount(post.likeCount || 0);
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };
    
    fetchLikeStatus();
  }, [postId]);
  
  // Function to toggle like status
  const toggleLike = useCallback(async () => {
    if (!postId) return;
    
    try {
      setLoading(true);
      
      if (liked) {
        await postService.unlikePost(postId);
        setLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        await postService.likePost(postId);
        setLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert UI if API call fails
      // Not reverting here to keep UI responsive
    } finally {
      setLoading(false);
    }
  }, [postId, liked]);
  
  return {
    liked,
    likeCount,
    loading,
    toggleLike
  };
};
/**
 * Custom hook for creating a post
 * @returns {Object} - Functions for post creation
 */
export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Function to create a post
  const createPost = useCallback(async (postData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await postService.createPost(postData);
      setSuccess(true);
      
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    createPost,
    loading,
    error,
    success
  };
};