import React from 'react';

export const SuccessUserModal = ({activeSection, successMessage, onDone}) => {
return (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in">
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Success!</h3>
      <p className="text-gray-600 text-center mb-6">
        {successMessage || `Your ${activeSection} information has been saved.`}
      </p>
      <button
        onClick={onDone}
        className="w-full py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Done
      </button>
    </div>
  </div>
) }
