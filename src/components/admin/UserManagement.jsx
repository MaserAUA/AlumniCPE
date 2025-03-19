import React, { useState, useEffect } from 'react';
import { FaUserEdit, FaTrash, FaUserShield, FaUser, FaUserCog, FaFilter, FaSearch, FaSave, FaTimes } from 'react-icons/fa';
import SharedDataService from './SharedDataService';

function UserManagement() {
  // Sample user roles
  const roles = [
    { id: 'admin', name: 'Administrator', color: 'bg-red-100 text-red-800 border-red-200' },
    { id: 'moderator', name: 'Content Moderator', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'user', name: 'Regular User', color: 'bg-green-100 text-green-800 border-green-200' }
  ];

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editableUserData, setEditableUserData] = useState({});

  // Load users from SharedDataService on component mount
  useEffect(() => {
    // Load initial data
    loadUsers();
    
    // Set up listener for data changes from other components
    const unsubscribe = SharedDataService.onDataUpdated(() => {
      // Reload data when it changes
      loadUsers();
    });
    
    // Clean up event listener on component unmount
    return () => unsubscribe();
  }, []);

  // Helper function to load users
  const loadUsers = () => {
    const storedUsers = SharedDataService.getTableData();
    // If no users, create sample data
    if (storedUsers.length === 0) {
      // This can be handled by Table component
      setUsers([]);
    } else {
      // Ensure all users have the required fields
      const formattedUsers = storedUsers.map((user, index) => ({
        id: user.studentID || String(index + 1),
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        studentID: user.studentID || '',
        role: user.role || 'user', // Default role
        cpeModel: user.cpeModel || '',
        favoriteSubject: user.favoriteSubject || '',
        workingCompany: user.workingCompany || '',
        jobPosition: user.jobPosition || '',
        lineOfWork: user.lineOfWork || '',
        nation: user.nation || '',
        course: user.course || '',
        salary: user.salary || '',
        createdAt: user.createdAt || new Date().toISOString(),
        status: user.status || 'active'
      }));
      
      setUsers(formattedUsers);
    }
  };

  // Filter users whenever the filters or users change
  useEffect(() => {
    let result = [...users];
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.studentID.includes(query)
      );
    }
    
    setFilteredUsers(result);
  }, [users, roleFilter, searchQuery]);

  // Handle editing a user
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setEditableUserData({...user});
    setShowEditModal(true);
  };

  // Handle saving user changes
  const handleSaveUser = () => {
    // Update the user using SharedDataService
    SharedDataService.updateUser(editableUserData);
    
    // Close modal
    setShowEditModal(false);
    setCurrentUser(null);
  };

  // Handle deleting a user
  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setShowDeleteConfirm(true);
  };

  // Confirm user deletion
  const confirmDeleteUser = () => {
    // Delete the user using SharedDataService
    SharedDataService.deleteUser(currentUser.id);
    
    setShowDeleteConfirm(false);
    setCurrentUser(null);
  };

  // Update editable user field
  const updateField = (field, value) => {
    setEditableUserData({...editableUserData, [field]: value});
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Get a color badge for roles
  const getRoleBadge = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.color : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FaUserCog className="text-blue-500 mr-2" />
          User Management System
        </h2>
        
        <div className="flex space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-blue-600">No users match your search criteria</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email / Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPE Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        {user.role === 'admin' && <FaUserShield />}
                        {user.role === 'moderator' && <FaUserCog />}
                        {user.role === 'user' && <FaUser />}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500">{user.workingCompany && `${user.workingCompany}, `}{user.jobPosition}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.studentID}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getRoleBadge(user.role)}`}>
                      {roles.find(r => r.id === user.role)?.name || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.cpeModel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit User"
                      >
                        <FaUserEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Edit User Information</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editableUserData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editableUserData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editableUserData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editableUserData.phoneNumber}
                  onChange={(e) => updateField('phoneNumber', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editableUserData.studentID}
                  onChange={(e) => updateField('studentID', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editableUserData.role}
                  onChange={(e) => updateField('role', e.target.value)}
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPE Model</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editableUserData.cpeModel}
                  onChange={(e) => updateField('cpeModel', e.target.value)}
                >
                  {Array.from({ length: 38 }, (_, i) => (
                    <option key={i} value={`CPE ${i + 1}`}>CPE {i + 1}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editableUserData.course}
                  onChange={(e) => updateField('course', e.target.value)}
                >
                  <option value="Regular">Regular</option>
                  <option value="INTER">INTER</option>
                  <option value="HDS">HDS</option>
                  <option value="RC">RC</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Working Company</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editableUserData.workingCompany || ''}
                  onChange={(e) => updateField('workingCompany', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Position</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editableUserData.jobPosition || ''}
                  onChange={(e) => updateField('jobPosition', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Line of Work</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editableUserData.lineOfWork || ''}
                  onChange={(e) => updateField('lineOfWork', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Subject</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editableUserData.favoriteSubject || ''}
                  onChange={(e) => updateField('favoriteSubject', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editableUserData.nation || ''}
                  onChange={(e) => updateField('nation', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editableUserData.salary || ''}
                  onChange={(e) => updateField('salary', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editableUserData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <FaSave className="mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FaTrash className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Delete User</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete user "{currentUser.firstName} {currentUser.lastName}" (Student ID: {currentUser.studentID})? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;