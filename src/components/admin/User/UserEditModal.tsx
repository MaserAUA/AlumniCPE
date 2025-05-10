import React from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { UpdateUserFormData } from '../../../models/user';

interface Role {
  id: string;
  name: string;
  color: string;
}

interface UserEditModalProps {
  isOpen: boolean;
  user: UpdateUserFormData | null;
  onClose: () => void;
  onSave: () => void;
  onFieldChange: (field: string, value: string) => void;
  roles: Role[];
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave,
  onFieldChange,
  roles,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Edit User Information</h3>
          <button
            onClick={onClose}
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
              value={user.first_name}
              onChange={(e) => onFieldChange('firstName', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={user.last_name}
              onChange={(e) => onFieldChange('lastName', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={user.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={user.phone}
              onChange={(e) => onFieldChange('phoneNumber', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={user.student_id}
              onChange={(e) => onFieldChange('studentID', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={user.role}
              onChange={(e) => onFieldChange('role', e.target.value)}
            >
              {["user", "admin", "alumnus"].map((role, index) => (
                <option key={index} value={role}>{role}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CPE Model</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={user.generation}
              onChange={(e) => onFieldChange('cpeModel', e.target.value)}
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
              value={user.student_type}
              onChange={(e) => onFieldChange('course', e.target.value)}
            >
              <option value="Regular">Regular</option>
              <option value="INTER">INTER</option>
              <option value="HDS">HDS</option>
              <option value="RC">RC</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FaSave className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
