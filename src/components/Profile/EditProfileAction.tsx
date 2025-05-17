import React from 'react';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Trash2, 
  X, 
  Save,
  Loader2
} from 'lucide-react';

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
    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
      <button
        onClick={onShowRequest}
        className="group px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium transition-all duration-300 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md hover:scale-105 focus:ring-2 focus:ring-indigo-200 focus:outline-none flex items-center justify-center gap-2"
      >
        <UserPlus className="w-4 h-4 text-gray-500 group-hover:text-indigo-500 group-hover:rotate-12 transition-all duration-300" />
        <span className="group-hover:text-indigo-600 transition-colors">Request Alumnus Role</span>
      </button>
      
      <button
        onClick={onShowChangeEmail}
        className="group px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium transition-all duration-300 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md hover:scale-105 focus:ring-2 focus:ring-blue-200 focus:outline-none flex items-center justify-center gap-2"
      >
        <Mail className="w-4 h-4 text-gray-500 group-hover:text-blue-500 group-hover:animate-bounce transition-all duration-300" />
        <span className="group-hover:text-blue-600 transition-colors">Change Email</span>
      </button>
      
      <button
        onClick={onShowResetPassword}
        className="group px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium transition-all duration-300 hover:bg-orange-50 hover:border-orange-300 hover:shadow-md hover:scale-105 focus:ring-2 focus:ring-orange-200 focus:outline-none flex items-center justify-center gap-2"
      >
        <Lock className="w-4 h-4 text-gray-500 group-hover:text-orange-500 group-hover:animate-pulse transition-all duration-300" />
        <span className="group-hover:text-orange-600 transition-colors">Reset Password</span>
      </button>

      <button
        onClick={onShowDelete}
        className="group px-6 py-2.5 rounded-lg bg-white border border-red-200 text-red-600 font-medium transition-all duration-300 hover:bg-red-600 hover:text-white hover:shadow-md hover:scale-105 focus:ring-2 focus:ring-red-300 focus:outline-none flex items-center justify-center gap-2"
      >
        <Trash2 className="w-4 h-4 group-hover:animate-pulse group-hover:rotate-12 transition-all duration-300" />
        <span>Delete Account</span>
      </button>

      <button
        onClick={onShowDiscard}
        disabled={!hasChanges || isLoading}
        className={`group px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
          hasChanges && !isLoading
            ? "hover:bg-gray-100 hover:shadow-md hover:scale-105 focus:ring-2 focus:ring-gray-300 focus:outline-none"
            : "opacity-50 cursor-not-allowed"
        }`}
      >
        <X className="w-4 h-4 text-gray-500 group-hover:rotate-90 transition-all duration-300" />
        <span>Discard Changes</span>
      </button>
      
      <button
        onClick={onShowSave}
        disabled={!hasChanges || isLoading}
        className={`group px-8 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${
          hasChanges && !isLoading
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-105 transform focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
            : "bg-blue-400 text-white opacity-50 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="w-5 h-5 group-hover:animate-bounce" />
            <span>Save Changes</span>
          </>
        )}
      </button>
    </div>
  );
}