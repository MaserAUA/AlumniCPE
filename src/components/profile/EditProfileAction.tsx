import React from 'react';

export const EditProfileAction = ({
  hasChanges,
  isLoading,
  onShowRequest,
  onShowChangeEmail,
  onShowResetPassword,
  onShowDelete,
  onShowDiscard,
  onShowSave
}) => {

  return (
    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-100">
      <button
        onClick={onShowRequest}
        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium transition-colors"
      >
        Request Alumnus Role
      </button>
      <button
        onClick={onShowChangeEmail}
        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium transition-colors"
      >
        Change Email
      </button>
      <button
        onClick={onShowResetPassword}
        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium transition-colors"
      >
        Reset Password
      </button>

      <button
        onClick={onShowDelete}
        className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
      >
        Delete Account
      </button>

      <button
        onClick={onShowDiscard}
        disabled={!hasChanges || isLoading}
        className={`px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium transition-colors ${
          hasChanges && !isLoading
            ? "hover:bg-gray-100 focus:ring-2 focus:ring-gray-300"
            : "opacity-50 cursor-not-allowed"
        }`}
      >
        Discard Changes
      </button>
      <button
        onClick={onShowSave}
        disabled={!hasChanges || isLoading}
        className={`px-8 py-2.5 rounded-lg bg-blue-600 text-white font-medium transition-colors ${
          hasChanges && !isLoading
            ? "hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            : "opacity-50 cursor-not-allowed"
        } flex items-center justify-center`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </div>
)}
