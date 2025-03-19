// SharedDataService.js
// Service for managing data sharing between Table and UserManagement components

// Custom event name for data updates
export const DATA_UPDATED_EVENT = 'table-data-updated';

/**
 * Get table data from localStorage
 * @returns {Array} Array of user objects
 */
export const getTableData = () => {
  const data = localStorage.getItem('tableData');
  return data ? JSON.parse(data) : [];
};

/**
 * Save table data to localStorage and dispatch update event
 * @param {Array} data - Array of user objects to save
 */
export const saveTableData = (data) => {
  localStorage.setItem('tableData', JSON.stringify(data));
  
  // Dispatch a custom event to notify other components
  const event = new CustomEvent(DATA_UPDATED_EVENT);
  window.dispatchEvent(event);
};

/**
 * Register a callback for data update events
 * @param {Function} callback - Function to call when data is updated
 * @returns {Function} Unsubscribe function
 */
export const onDataUpdated = (callback) => {
  window.addEventListener(DATA_UPDATED_EVENT, callback);
  return () => window.removeEventListener(DATA_UPDATED_EVENT, callback);
};

/**
 * Add a new user to the data
 * @param {Object} userData - User data object
 * @returns {Object} The added user with ID
 */
export const addUser = (userData) => {
  const currentData = getTableData();
  
  // Create a new user with ID if not provided
  const newUser = {
    ...userData,
    id: userData.id || userData.studentID || Date.now().toString(),
    createdAt: userData.createdAt || new Date().toISOString()
  };
  
  const updatedData = [...currentData, newUser];
  saveTableData(updatedData);
  return newUser;
};

/**
 * Update an existing user
 * @param {Object} userData - User data with ID
 * @returns {Object} The updated user data
 */
export const updateUser = (userData) => {
  const currentData = getTableData();
  const updatedData = currentData.map(user => 
    (user.id === userData.id || user.studentID === userData.studentID) ? userData : user
  );
  
  saveTableData(updatedData);
  return userData;
};

/**
 * Delete a user by ID
 * @param {string} userId - ID of the user to delete
 * @returns {string} ID of the deleted user
 */
export const deleteUser = (userId) => {
  const currentData = getTableData();
  const updatedData = currentData.filter(user => 
    user.id !== userId && user.studentID !== userId
  );
  
  saveTableData(updatedData);
  return userId;
};

/**
 * Get user by ID
 * @param {string} userId - ID of the user to find
 * @returns {Object|null} User object or null if not found
 */
export const getUserById = (userId) => {
  const users = getTableData();
  return users.find(user => user.id === userId || user.studentID === userId) || null;
};

/**
 * Filter users by criteria
 * @param {Object} criteria - Filtering criteria
 * @returns {Array} Filtered array of users
 */
export const filterUsers = (criteria = {}) => {
  const users = getTableData();
  
  return users.filter(user => {
    // Loop through each criteria and check if user matches
    return Object.entries(criteria).every(([key, value]) => {
      // Skip if value is undefined or null
      if (value === undefined || value === null) return true;
      
      // Special case for text search across multiple fields
      if (key === 'search') {
        const searchTerm = String(value).toLowerCase();
        return Object.values(user).some(fieldValue => 
          String(fieldValue).toLowerCase().includes(searchTerm)
        );
      }
      
      // Regular field matching
      return user[key] === value;
    });
  });
};

// Export all functions as a default object
export default {
  getTableData,
  saveTableData,
  onDataUpdated,
  addUser,
  updateUser,
  deleteUser,
  getUserById,
  filterUsers
};