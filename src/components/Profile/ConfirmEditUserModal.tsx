import React from 'react';

export const ConfirmEditUserModal = ({
  profileImage,
  newProfileImage,
  onCancel,
  onConfirm
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Change Profile Picture?</h3>
        <div className="flex justify-center items-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Current</p>
            <img
              src={profileImage}
              alt="Current Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
          <div className="flex items-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">New</p>
            { newProfileImage && (
              <img
                src={newProfileImage}
                alt="New Profile Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-300"
              />
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
)}
