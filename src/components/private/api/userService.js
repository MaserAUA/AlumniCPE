// src/components/private/api/userService.js
import api, { authApi } from '../../auth/api/authApi';
import { handleApiError } from '../../auth/api/apiUtils';

/**
 * User service that extends authApi functionality with more specific user-focused methods
 * This service helps organize API calls related to user operations
 */
export const userService = {
  /**
   * Get user profile information
   * @returns {Promise<Object>} User profile data
   */
  getProfile: async () => {
    try {
      return await authApi.user.getById(authApi.user.id);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Update user profile information
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile data
   */
  updateProfile: async (profileData) => {
    try {
      return await authApi.user.updateUser(profileData.id || 'me', profileData);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get user posts
   * @returns {Promise<Object>} User posts data
   */
  getPosts: async () => {
    try {
      return await authApi.post.getAll();
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
      return await authApi.post.create(postData);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Update an existing post
   * @param {String} postId - ID of the post to update
   * @param {Object} postData - Post data to update
   * @returns {Promise<Object>} Updated post data
   */
  updatePost: async (postId, postData) => {
    try {
      return await authApi.post.update(postId, postData);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Delete a post
   * @param {String} postId - ID of the post to delete
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
   * Get alumni data with filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Alumni data
   */
  getAlumni: async (filters = {}) => {
    try {
      return await authApi.user.getByFilter(filters);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Search alumni by term and filters
   * @param {String} searchTerm - Search term
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Search results
   */
  searchAlumni: async (searchTerm, filters = {}) => {
    try {
      return await authApi.user.getByFulltext(searchTerm);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Find CPE members by search parameters
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Search results
   */
  findCPE: async (searchParams) => {
    try {
      // Direct API call to the find-cpe endpoint
      const response = await api.get('/user/find-cpe', {
        params: searchParams
      });
      return response.data;
    } catch (error) {
      // Instead of falling back to mock, properly handle the error
      const formattedError = handleApiError(error);
      console.error("Error finding CPE:", formattedError);
      // Return empty results as a fallback
      return {
        results: [],
        total: 0,
        error: formattedError.message
      };
    }
  }
};

export default userService;