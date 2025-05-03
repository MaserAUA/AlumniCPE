import React from 'react';
import { useNavigate } from "react-router-dom";
import { useDeleteUserById } from "../../hooks/useUser"
import { useAuthContext } from "../../context/auth_context";

export const DeleteUserModal = ({onClose}) => {
  const { userId } = useAuthContext()
  const navigate = useNavigate()
  const deleteUserMutation = useDeleteUserById()
  const handleDeleteAccount = () => {
    deleteUserMutation.mutate(userId || "")
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Account</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete your account? <br /> 
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAccount}
            className="flex-1 py-2.5 px-4 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition-colors"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
)}
