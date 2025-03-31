// src/components/auth/api/apiUtils.js

/**
 * Utility functions for API handling
 */

/**
 * Function to handle errors from API
 * @param {Error} error - error object from API call
 * @returns {Object} - formatted error message
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with status code outside of 2xx range
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return {
          code: status,
          message: data.message || 'Invalid data. Please check and try again.',
          errors: data.errors || []
        };
      case 401:
        return {
          code: status,
          message: 'Authentication expired or invalid. Please login again.',
          errors: []
        };
      case 403:
        return {
          code: status,
          message: 'You do not have permission to access this resource.',
          errors: []
        };
      case 404:
        return {
          code: status,
          message: 'Resource not found.',
          errors: []
        };
      case 500:
      case 502:
      case 503:
        return {
          code: status,
          message: 'Server error. Please try again later.',
          errors: []
        };
      default:
        return {
          code: status,
          message: data.message || 'Error connecting to server.',
          errors: data.errors || []
        };
    }
  } else if (error.request) {
    // Request was made but no response received
    return {
      code: 0,
      message: 'Unable to connect to server. Please check your internet connection.',
      errors: []
    };
  } else {
    // Error in setting up the request
    return {
      code: 0,
      message: error.message || 'An error occurred while sending the request.',
      errors: []
    };
  }
};

/**
 * Function to format request parameters
 * @param {Object} params - parameters to be sent
 * @returns {Object} - formatted parameters
 */
export const formatRequestParams = (params) => {
  // Filter out null, undefined, and empty string values
  const formattedParams = {};
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      formattedParams[key] = value;
    }
  });
  
  return formattedParams;
};

/**
 * Function to convert data to FormData
 * @param {Object} data - data to be converted to FormData
 * @returns {FormData} - FormData created from the data
 */
export const createFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (value !== null && value !== undefined) {
      // File or Blob
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } 
      // Array
      else if (Array.isArray(value)) {
        if (value.length > 0) {
          if (value[0] instanceof File || value[0] instanceof Blob) {
            // Array of Files
            value.forEach(file => {
              formData.append(`${key}[]`, file);
            });
          } else {
            // Regular array
            formData.append(key, JSON.stringify(value));
          }
        }
      } 
      // Object
      else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });
  
  return formData;
};

/**
 * Function for delay (used for mock API to simulate network latency)
 * @param {number} ms - time to delay in milliseconds
 * @returns {Promise} - Promise that resolves after specified delay
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Function to get auth token from local storage
 * @returns {string|null} - token or null if no token exists
 */
export const getAuthToken = () => localStorage.getItem('token');

/**
 * Function to check if response is JSON
 * @param {Response} response - response object from fetch API
 * @returns {boolean} - true if response is JSON
 */
export const isJsonResponse = (response) => {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.includes('application/json');
};

export default {
  handleApiError,
  formatRequestParams,
  createFormData,
  delay,
  getAuthToken,
  isJsonResponse
};