// src/components/auth/api/authApi.js
import axios from 'axios';

// API Configuration
// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://alumni-api.fly.dev/v1',
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/auth/login',
    REGISTER: '/auth/registry',
    CHANGE_PASSWORD: '/auth/change_password',
    VERIFY_EMAIL: '/auth/verify-email',
    VERIFY_ACCOUNT: '/auth/verify-account',
    REQUEST_RESET_PASSWORD: '/auth/request_reset_password',
    REQUEST_CHANGE_EMAIL: '/auth/request_change_email',
    VALIDATE_TOKEN: '/auth/validate',
    
    // User endpoints
   
    USER_BY_ID: '/users/:id',
    USER_BY_FILTER: '/user/filter',
    USER_BY_FULLTEXT: '/users/fulltext_search',
    USER_ASSOCIATED: '/users/company_associate',
    USER_FRIEND_OF_FRIEND: '/user/friend-of-friend',
    USER_PROFILE: '/user/profile',
    CREATE_PROFILE: '/users',
    UPDATE_USER: '/users/:id',
    DELETE_USER: '/users/:id',
    USER_FRIEND: '/users/:id/friends',
    ADD_FRIEND: '/users/:id/friends',
    UNFRIEND: '/users/:id/friends',
    STUDENT_INFO: '/users/:id/student_info',
    UPDATE_STUDENT_INFO: '/users/:id/student_info',
    REMOVE_STUDENT_INFO: '/users/:id/student_info',
    USER_COMPANY: '/users/:id/companies',
    UPDATE_USER_COMPANY: '/users/:user_id/companies/:company_id',
    DELETE_USER_COMPANY: '/users/:user_id/companies/:company_id',
    
    // Post endpoints
    POSTS: '/post',
    POST_BY_ID: '/post/:post_id',
    CREATE_POST: '/post',
    UPDATE_POST: '/post/:post_id',
    DELETE_POST: '/post/:post_id',
    LIKE_POST: '/post/:post_id/like',
    UNLIKE_POST: '/post/:post_id/like',
    COMMENT: '/post/:post_id/comment',
    REPLY_COMMENT: '/post/comment/:comment_id',
    EDIT_COMMENT: '/post/comment/:comment_id',
    REMOVE_COMMENT: '/post/comment/:comment_id',
    LIKE_COMMENT: '/post/comment/:comment_id/like',
    UNLIKE_COMMENT: '/post/comment/:comment_id/like',
    
    // Message endpoints
    CHAT_MESSAGES: '/user/:user_id/chat_message/:other_user_id',
    SEND_MESSAGE: '/user/:user_id/message/send',
    REPLY_MESSAGE: '/user/:user_id/message/reply',
    EDIT_MESSAGE: '/user/:user_id/message/:message_id',
    DELETE_MESSAGE: '/user/:user_id/message/:message_id',
    
    // Utils endpoints
    GET_REPORT: '/utils/report',
    POST_REPORT: '/utils/report',
    
    // Stat endpoints
    GET_POST_USER_STAT: '/stat/post',
    GET_GENERATION_STAT: '/stat/generation',
    GET_USER_SALARY: '/stat/salary',
    GET_USER_JOB: '/stat/job',
    GET_ALUMNI_REGISTRY_STAT: '/stat/registry',
    UPLOAD_FILE: '/upload',
    TEST_REQUEST: '/',
  },
  TIMEOUT: 15000,
  RETRY_COUNT: 2
};

// Error handling utility
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with status code outside of 2xx range
    return {
      code: error.response.status,
      message: error.response.data?.message || 'Error connecting to server',
      errors: error.response.data?.errors || []
    };
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
      message: error.message || 'An error occurred while sending the request',
      errors: []
    };
  }
};

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT
});

// Request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors and token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Retry on Network Error
    if (error.message === 'Network Error' && 
        (!originalRequest._retry || originalRequest._retry < API_CONFIG.RETRY_COUNT)) {
      
      originalRequest._retry = (originalRequest._retry || 0) + 1;
      
      // Wait 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return api(originalRequest);
    }
    
    // Handle token expiration
    if (error.response && error.response.status === 401 && 
        error.response.data?.message === 'Token expired') {
      // Clear all authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      
      // Redirect to login page
      window.location.href = '/login?sessionExpired=true';
    }
    
    return Promise.reject(error);
  }
);

// Auth API methods
export const authApi = {
  // Login method
  login: async (email, password) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, {
        username: email,
        password
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Register method
  register: async (userData) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Validate token
  validateToken: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.VALIDATE_TOKEN);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Auth methods
  auth: {
    verifyAccount: async (token) => {
      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.VERIFY_ACCOUNT, { params: { token } });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    requestResetPassword: async (email) => {
      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.REQUEST_RESET_PASSWORD, { params: { email } });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    changePassword: async (data) => {
      try {
        const response = await api.post(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, data);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    requestChangeEmail: async (email) => {
      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.REQUEST_CHANGE_EMAIL, { params: { email } });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    verifyEmail: async (token) => {
      try {
        const response = await api.post(API_CONFIG.ENDPOINTS.VERIFY_EMAIL, { token });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    }
  },
  
  // User endpoints
  user: {
    // Get all users
    getAll: async () => {
      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.USER);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Get user by ID
    getById: async (userId) => {
      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.USER_BY_ID.replace(':user_id', userId));
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Get users by filter
    getByFilter: async (filterParams) => {
      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.USER_BY_FILTER, { params: filterParams });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Get users by fulltext search
    getByFulltext: async (searchText) => {
      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.USER_BY_FULLTEXT, { params: { search: searchText } });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Get associated users
    getAssociated: async (params) => {
      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.USER_ASSOCIATED, { params });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Get friend of friend
    getFriendOfFriend: async (userId) => {
      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.USER_FRIEND_OF_FRIEND, { params: { userId } });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Create profile
    createProfile: async (profileData) => {
      try {
        const response = await api.post(API_CONFIG.ENDPOINTS.CREATE_PROFILE, profileData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Update user
    updateUser: async (userId, userData) => {
      try {
        const response = await api.put(API_CONFIG.ENDPOINTS.UPDATE_USER.replace(':user_id', userId), userData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Delete user
    deleteUser: async (userId) => {
      try {
        const response = await api.delete(API_CONFIG.ENDPOINTS.DELETE_USER.replace(':user_id', userId));
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Get user friends
    getFriends: async (userId) => {
      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.USER_FRIEND.replace(':user_id', userId));
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Add friend
    addFriend: async (friendData) => {
      try {
        const response = await api.post(API_CONFIG.ENDPOINTS.ADD_FRIEND, friendData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Unfriend
    unfriend: async (friendId) => {
      try {
        const response = await api.delete(API_CONFIG.ENDPOINTS.UNFRIEND, { data: { friendId } });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Add student info
    addStudentInfo: async (studentData) => {
      try {
        const response = await api.post(API_CONFIG.ENDPOINTS.STUDENT_INFO, studentData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Update student info
    updateStudentInfo: async (studentData) => {
      try {
        const response = await api.put(API_CONFIG.ENDPOINTS.UPDATE_STUDENT_INFO, studentData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Remove student info
    removeStudentInfo: async (studentId) => {
      try {
        const response = await api.delete(API_CONFIG.ENDPOINTS.REMOVE_STUDENT_INFO, { data: { studentId } });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Add company
    addCompany: async (companyData) => {
      try {
        const response = await api.post(API_CONFIG.ENDPOINTS.USER_COMPANY, companyData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Update company
    updateCompany: async (companyData) => {
      try {
        const response = await api.put(API_CONFIG.ENDPOINTS.UPDATE_USER_COMPANY, companyData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Delete company
    deleteCompany: async (companyId) => {
      try {
        const response = await api.delete(API_CONFIG.ENDPOINTS.DELETE_USER_COMPANY, { data: { companyId } });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    }
  },
  
  // Post endpoints
  post: {
    // Get all posts
    getAll: async () => {
      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.POSTS);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Get post by ID
    getById: async (postId) => {
      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.POST_BY_ID.replace(':post_id', postId));
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Create post
    create: async (postData) => {
      try {
        const response = await api.post(API_CONFIG.ENDPOINTS.CREATE_POST, postData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Update post
    update: async (postId, postData) => {
      try {
        const response = await api.put(API_CONFIG.ENDPOINTS.UPDATE_POST.replace(':post_id', postId), postData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Delete post
    delete: async (postId) => {
      try {
        const response = await api.delete(API_CONFIG.ENDPOINTS.DELETE_POST.replace(':post_id', postId));
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Like post
    like: async (postId) => {
      try {
        const response = await api.post(API_CONFIG.ENDPOINTS.LIKE_POST.replace(':post_id', postId));
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Unlike post
    unlike: async (postId) => {
      try {
        const response = await api.delete(API_CONFIG.ENDPOINTS.UNLIKE_POST.replace(':post_id', postId));
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Comment on post
    comment: async (postId, commentData) => {
      try {
        const response = await api.post(API_CONFIG.ENDPOINTS.COMMENT.replace(':post_id', postId), commentData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Reply to comment
    replyComment: async (commentId, replyData) => {
      try {
        const response = await api.post(API_CONFIG.ENDPOINTS.REPLY_COMMENT.replace(':comment_id', commentId), replyData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Edit comment
    editComment: async (commentId, commentData) => {
      try {
        const response = await api.put(API_CONFIG.ENDPOINTS.EDIT_COMMENT.replace(':comment_id', commentId), commentData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Remove comment
    removeComment: async (commentId) => {
      try {
        const response = await api.delete(API_CONFIG.ENDPOINTS.REMOVE_COMMENT.replace(':comment_id', commentId));
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Like comment
    likeComment: async (commentId) => {
      try {
        const response = await api.post(API_CONFIG.ENDPOINTS.LIKE_COMMENT.replace(':comment_id', commentId));
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Unlike comment
    unlikeComment: async (commentId) => {
      try {
        const response = await api.delete(API_CONFIG.ENDPOINTS.UNLIKE_COMMENT.replace(':comment_id', commentId));
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    }
  },
  
  // Message endpoints
  message: {
    // Get messages
    getMessages: async () => {
      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.MESSAGES);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Send message
    send: async (messageData) => {
      try {
        const response = await api.post(API_CONFIG.ENDPOINTS.SEND_MESSAGE, messageData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Reply to message
    reply: async (replyData) => {
      try {
        const response = await api.post(API_CONFIG.ENDPOINTS.REPLY_MESSAGE, replyData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Edit message
    edit: async (messageId, messageData) => {
      try {
        const response = await api.put(API_CONFIG.ENDPOINTS.EDIT_MESSAGE.replace(':message_id', messageId), messageData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Delete message
    delete: async (messageId) => {
      try {
        const response = await api.delete(API_CONFIG.ENDPOINTS.DELETE_MESSAGE.replace(':message_id', messageId));
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    }
  },
  
  // Utils endpoints
  utils: {
    // Get report
    getReport: async (params) => {
      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.GET_REPORT, { params });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    
    // Post report
    report: async (reportData) => {
      try {
        const response = await api.post(API_CONFIG.ENDPOINTS.POST_REPORT, reportData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    }
  },
  
  // Stat endpoints
 // Stat endpoints
stat: {
  // Get Post User Stat
  getPostUserStat: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.GET_POST_USER_STAT);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Get Generation Stat
  getGenerationStat: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.GET_GENERATION_STAT);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Get User Salary
  getUserSalary: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.GET_USER_SALARY);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Get User Job
  getUserJob: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.GET_USER_JOB);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Get Alumni Registry Stat
  getAlumniRegistryStat: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.GET_ALUMNI_REGISTRY_STAT);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Upload file
  uploadFile: async (fileData) => {
    try {
      const formData = new FormData();
      formData.append('file', fileData);
      
      const response = await api.post(API_CONFIG.ENDPOINTS.UPLOAD_FILE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Test request
  testRequest: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.TEST_REQUEST);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}
};

export default api;