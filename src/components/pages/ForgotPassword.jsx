import React, { useState, useEffect } from "react";
import { FaLock, FaEnvelope, FaArrowLeft, FaCheck } from "react-icons/fa";
import "aos/dist/aos.css";
import AOS from "aos";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Validate email
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

      // เรียกใช้ API Request Reset Password
      const response = await fetch("https://alumni-api.fly.dev/v1/auth/request-reset-password", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        // ส่งข้อมูลเป็น query parameter แทน เนื่องจากเป็น GET request
        // ต้องตรวจสอบกับ API ว่าต้องการให้ส่งข้อมูลแบบใด
      });
      
      // ถ้า API ต้องการให้ส่งข้อมูลใน body แม้จะเป็น GET (ไม่แนะนำ แต่บางครั้งก็มี)
      // สามารถใช้ URL ในรูปแบบ /request-reset-password?email=user@example.com
      const url = new URL("https://alumni-api.fly.dev/v1/auth/request-reset-password");
      url.searchParams.append("email", email);
      
      const getResponse = await fetch(url.toString(), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!getResponse.ok) {
        const errorData = await getResponse.json();
        throw new Error(errorData.message || "Failed to request password reset");
      }
      
      setIsLoading(false);
      setShowPopup(true);
      
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    // Redirect to homepage after closing popup
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-5 font-inter">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden"
        data-aos="fade-up"
      >
        {/* Top decoration */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-50 p-4 rounded-full mb-4 hover:scale-110 transition-transform duration-500 shadow-md">
            <FaLock className="text-5xl text-blue-500" />
          </div>

          <h2 className="text-center text-3xl font-bold text-gray-800 mb-2" data-aos="zoom-in">
            Forgot Password
          </h2>
          
          <p className="text-gray-500 text-center max-w-md">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
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

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>
          
          {/* Back to Login Button */}
          <div className="flex justify-center">
            <a
              href="/login"
              className="flex items-center text-blue-500 hover:text-blue-700 transition duration-300"
            >
              <FaArrowLeft className="mr-2" />
              Back to Login
            </a>
          </div>
        </form>

        {/* Email Verification Popup */}
        {showPopup && (
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
                </div>
                
                <button
                  onClick={handlePopupClose}
                  className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition duration-300"
                >
                  <FaCheck className="inline mr-2" />
                  OK, I'll Check My Email
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;