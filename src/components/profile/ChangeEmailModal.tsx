import React, { useState, useEffect } from 'react';
import { useRequestChangeEmail } from '../../api/auth';
import AOS from "aos";
import "aos/dist/aos.css";

import { FaLock, FaEnvelope, FaCheck } from "react-icons/fa";
export const ChangeEmailModal = ({onCancel}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const requestChangeEmail = useRequestChangeEmail()
  
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      requestChangeEmail.mutate(email, {
        onSuccess(data, variables, context) {
          setReferenceNumber(data["reference_number"])
          setIsLoading(false);
          setShowPopup(true);
        },
        onError(error, variables, context) {
          setError(`${variables} Already been used`)
          setIsLoading(false)
        },
      })
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  return (
    !showPopup ? (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-50 p-4 rounded-full mb-4 hover:scale-110 transition-transform duration-500 shadow-md">
            <FaLock className="text-5xl text-blue-500" />
          </div>

          <h2 className="text-center text-3xl font-bold text-gray-800 mb-2" data-aos="zoom-in">
              Change Email
          </h2>
          
          <p className="text-gray-500 text-center max-w-md">
            Enter your email address and we'll send you a link to change your associate email
          </p>
        </div>

        <form className="space-y-6 mb-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaEnvelope className="text-blue-400" />
              </div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                disabled={isLoading}
                className="pl-10 block w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg flex items-center" data-aos="fade-in">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
        </form>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors"
          >
            { isLoading ? "Sending . . ." : "Confirm" }
          </button>
        </div>
      </div>
    </div>
    ) : (
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
              onClick={()=>{
                setShowPopup(false);
                onCancel();
              }}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition duration-300"
            >
              <FaCheck className="inline mr-2" />
              OK, I'll Check My Email
            </button>
          </div>
        </div>
      </div>
    )
)}
