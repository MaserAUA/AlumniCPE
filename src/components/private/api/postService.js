// src/components/private/api/postService.js
import api, { authApi } from '../../auth/api/authApi';
import { handleApiError } from '../../auth/api/apiUtils';

/**
 * Post service for handling post-related API operations
 */
export const postService = {
  /**
   * Get all posts
   * @param {Object} filters - Filter parameters (category, cpeGroup, etc.)
   * @returns {Promise<Object>} Posts data
   */
  getPosts: async (filters = {}) => {
    try {
      return await authApi.post.getAll(filters);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get a single post by ID
   * @param {String} postId - ID of post to retrieve
   * @returns {Promise<Object>} Post data
   */
  getPostById: async (postId) => {
    try {
      return await authApi.post.getById(postId);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Create a new post
   * @param {Object} postData - Post data to create
   * @returns {Promise<Object>} Created post data
   */
  createPost: async (postData) => {
    try {
      // Handle images with FormData if present
      if (postData.images && postData.images.length > 0) {
        const formData = new FormData();
        
        // Add all other fields to formData
        Object.keys(postData).forEach(key => {
          if (key !== 'images') {
            // Handle special cases like objects that need to be stringified
            if (typeof postData[key] === 'object' && postData[key] !== null) {
              formData.append(key, JSON.stringify(postData[key]));
            } else {
              formData.append(key, postData[key]);
            }
          }
        });
        
        // Add images
        postData.images.forEach((image) => {
          formData.append(`images`, image);
        });
        
        return await authApi.post.create(formData);
      } else {
        // No images, send as JSON
        return await authApi.post.create(postData);
      }
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Update an existing post
   * @param {String} postId - ID of post to update
   * @param {Object} postData - Updated post data
   * @returns {Promise<Object>} Updated post data
   */
  updatePost: async (postId, postData) => {
    try {
      // Similar logic to createPost for handling images if needed
      if (postData.images && postData.images.length > 0 && postData.images.some(img => img instanceof File)) {
        const formData = new FormData();
        
        // Add all other fields to formData
        Object.keys(postData).forEach(key => {
          if (key !== 'images') {
            if (typeof postData[key] === 'object' && postData[key] !== null) {
              formData.append(key, JSON.stringify(postData[key]));
            } else {
              formData.append(key, postData[key]);
            }
          }
        });
        
        // Add images - only add File objects, existing image URLs would be handled differently
        postData.images.forEach((image) => {
          if (image instanceof File) {
            formData.append(`images`, image);
          } else if (typeof image === 'string') {
            // Existing image URLs might need to be handled differently depending on your API
            formData.append('existingImages', image);
          }
        });
        
        return await authApi.post.update(postId, formData);
      } else {
        // No new images, send as JSON
        return await authApi.post.update(postId, postData);
      }
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Delete a post
   * @param {String} postId - ID of post to delete
   * @returns {Promise<Object>} Deletion response
   */
  deletePost: async (postId) => {
    try {
      return await authApi.post.delete(postId);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Like a post
   * @param {String} postId - ID of post to like
   * @returns {Promise<Object>} Like response
   */
  likePost: async (postId) => {
    try {
      return await authApi.post.like(postId);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Unlike a post
   * @param {String} postId - ID of post to unlike
   * @returns {Promise<Object>} Unlike response
   */
  unlikePost: async (postId) => {
    try {
      return await authApi.post.unlike(postId);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Add a comment to a post
   * @param {String} postId - ID of post to comment on
   * @param {Object} commentData - Comment data
   * @returns {Promise<Object>} Comment response
   */
  addComment: async (postId, commentData) => {
    try {
      return await authApi.post.comment(postId, commentData);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Reply to a comment
   * @param {String} commentId - ID of comment to reply to
   * @param {Object} replyData - Reply data
   * @returns {Promise<Object>} Reply response
   */
  replyToComment: async (commentId, replyData) => {
    try {
      return await authApi.post.replyComment(commentId, replyData);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get comments for a post
   * @param {String} postId - ID of post to get comments for
   * @returns {Promise<Array>} Comments data
   */
  getComments: async (postId) => {
    try {
      // This endpoint might need to be adjusted based on your actual API
      const response = await authApi.post.getById(postId);
      return response.comments || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Report a post
   * @param {Object} reportData - Report data with postId, reason, etc.
   * @returns {Promise<Object>} Report response
   */
  reportPost: async (reportData) => {
    try {
      return await authApi.utils.report(reportData);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Remove the mock implementation as we're using real API now
}