import React, { useState, useEffect } from 'react';
import { FaUserCog } from 'react-icons/fa';
import { useGetAllUser } from '../../hooks/useUser';
import UserTable from '../../components/admin/User/UserTable';
import UserEditModal from '../../components/admin/User/UserEditModal';
import DeleteConfirmationModal from '../../components/admin/User/DeleteConfirmationModal';
import PaginationControls from '../../components/admin/User/PaginationControls';
import UserFilters from '../../components/admin/User/UserFilters';
import { UpdateUserFormData } from '../../models/user';

const roles = [
  { id: 'admin', name: 'Administrator', color: 'bg-red-100 text-red-800 border-red-200' },
  { id: 'user', name: 'User', color: 'bg-green-100 text-green-800 border-green-200' },
  { id: 'alumnus', name: 'Alumni', color: 'bg-blue-100 text-blue-800 border-blue-200' },
];

const UserManagement = () => {
  const [users, setUsers] = useState<UpdateUserFormData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UpdateUserFormData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentUser, setCurrentUser] = useState<UpdateUserFormData | null>(null);
  const [editableUserData, setEditableUserData] = useState<Partial<UpdateUserFormData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: userData, isLoading: isLoadingData } = useGetAllUser();

  // Load users from API on component mount
  useEffect(() => {
    setIsLoading(true);
    if (!isLoadingData) {
      const formattedUsers = userData.map((user, index) => ({
        id: user.studentID || String(index + 1),
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phoneNumber: user.phone || '',
        studentID: user.studentID || '',
        role: user.role || 'student',
        cpeModel: user.generation || '',
        favoriteSubject: user.favoriteSubject || '',
        workingCompany: user.company || '',
        jobPosition: user.position || '',
        lineOfWork: user.lineOfWork || '',
        nation: user.nation || '',
        course: user.student_type || '',
        salary: user.salary || '',
        createdAt: user.createdAt || new Date().toISOString(),
        status: user.status || 'active'
      }));
      
      setUsers(formattedUsers);
    }
    setIsLoading(false);
  }, [userData, isLoadingData]);

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
        user.first_name?.toLowerCase().includes(query) ||
        user.last_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        (user.student_id && user.student_id.includes(query))
      );
    }
    
    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, roleFilter, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle editing a user
  const handleEditUser = (user: UpdateUserFormData) => {
    setCurrentUser(user);
    setEditableUserData({...user});
    setShowEditModal(true);
  };

  // Handle saving user changes
  const handleSaveUser = () => {
    // TODO: Implement API call to update user
    const updatedUsers = users.map(user => 
      user.user_id === editableUserData.user_id ? {...user, ...editableUserData} : user
    );
    setUsers(updatedUsers);
    
    setShowEditModal(false);
    setCurrentUser(null);
  };

  // Handle deleting a user
  const handleDeleteUser = (user: UpdateUserFormData) => {
    setCurrentUser(user);
    setShowDeleteConfirm(true);
  };

  // Confirm user deletion
  const confirmDeleteUser = () => {
    // TODO: Implement API call to delete user
    const updatedUsers = users.filter(user => user.user_id !== currentUser?.user_id);
    setUsers(updatedUsers);
    
    setShowDeleteConfirm(false);
    setCurrentUser(null);
  };

  // Update editable user field
  const updateField = (field: string, value: string) => {
    setEditableUserData(prev => ({...prev, [field]: value}));
  };

  // Format date
  const formatDate = (dateString: string) => {
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
  const getRoleBadge = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.color : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get role name for display
  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FaUserCog className="text-blue-500 mr-2" />
          User Management System
        </h2>
        
        <UserFilters
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          roleFilter={roleFilter}
          onRoleFilterChange={(e) => setRoleFilter(e.target.value)}
          roles={roles}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-blue-600">No users match your search criteria</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <UserTable
            users={paginatedUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            getRoleBadge={getRoleBadge}
            getRoleName={getRoleName}
            formatDate={formatDate}
          />
        </div>
      )}

      {filteredUsers.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredUsers.length}
          onPageChange={setCurrentPage}
        />
      )}

      <UserEditModal
        isOpen={showEditModal}
        user={editableUserData as UpdateUserFormData}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveUser}
        onFieldChange={updateField}
        roles={roles}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        user={currentUser}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
};

export default UserManagement;
