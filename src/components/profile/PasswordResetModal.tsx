import React from 'react';
import { FaCheck } from "react-icons/fa";

export const PasswordResetModal = ({
  email,
  referenceNumber,
  onClose,
}) => {
  return (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-blue-500 bg-opacity-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 pb-6 relative" data-aos="zoom-in">
      {/* Circle with checkmark that overlaps the top */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
        <div className="w-24 h-24 rounded-full bg-green-100 border-4 border-white flex items-center justify-center">
          <FaCheck className="text-2xl text-green-500" />
        </div>
      </div>
      
      <div className="flex flex-col items-center text-center pt-16 px-6">
        <h3 className="text-2xl font-bold text-green-500 mb-6">
          Email Verification Required
        </h3>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4 w-full text-left">
          <p className="text-gray-600 mb-3">
            We've sent a password reset link to:
          </p>
          
          <p className="text-gray-800 font-semibold mb-3 text-center">
            {email}
          </p>
          
          <p className="text-gray-600">
            Please check your inbox and follow the instructions to reset your password.
          </p>
            
          <p className="text-gray-800 font-semibold mb-3 text-center">
            ref: {referenceNumber}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition duration-300"
        >
          <FaCheck className="inline mr-2" />
          OK, I'll Check My Email
        </button>
      </div>
    </div>
  </div>
)}
