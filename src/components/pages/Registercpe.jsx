import React, { useState, useEffect, useRef } from "react";
import { FaUserEdit, FaLock, FaEnvelope, FaArrowLeft, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "aos/dist/aos.css";
import AOS from "aos";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const RegisterCPE = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [confirmPasted, setConfirmPasted] = useState(false);
  const confirmPasswordRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setError(""); // Clear error when user types

    // Check password strength when password field changes
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    });
  };

  const handlePaste = (e) => {
    e.preventDefault();
    setConfirmPasted(true);
    setTimeout(() => setConfirmPasted(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
  
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }
  
    if (!formData.email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }
  
    if (!passwordStrength.hasMinLength || 
        !passwordStrength.hasUpperCase || 
        !passwordStrength.hasLowerCase || 
        !passwordStrength.hasNumber || 
        !passwordStrength.hasSpecialChar) {
      setError("Password does not meet all requirements");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    try {
      setIsLoading(true);
      setError("");
  
      // 🔐 POST to secure HTTPS backend (must allow credentials + CORS)
      const response = await fetch("https://alumni.cpe.kmutt.ac.th/api/v1/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
        credentials: "include"  // 👈 สำคัญมาก
      });
      
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to register");
      }
  
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Redirecting...",
        timer: 2000,
        showConfirmButton: false,
      });
  
      setIsLoading(false);
      navigate('/emailverification');
      
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Registration Error",
        text: err.message || "An unexpected error occurred.",
      });
      setIsLoading(false);
    }
  };
  
  const PasswordRequirements = () => {
    return (
      <div className="mt-2 text-sm">
        <p className="font-medium text-gray-700 mb-1">Password must:</p>
        <ul className="space-y-1 pl-1">
          <li className={`flex items-center ${passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
            {passwordStrength.hasMinLength ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
            Be at least 8 characters long
          </li>
          <li className={`flex items-center ${passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
            {passwordStrength.hasUpperCase ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
            Contain at least 1 uppercase letter
          </li>
          <li className={`flex items-center ${passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
            {passwordStrength.hasLowerCase ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
            Contain at least 1 lowercase letter
          </li>
          <li className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
            {passwordStrength.hasNumber ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
            Contain at least 1 number
          </li>
          <li className={`flex items-center ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
            {passwordStrength.hasSpecialChar ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
            Contain at least 1 special character (!@#$%^&*)
          </li>
        </ul>
      </div>
    );
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
            <FaUserEdit className="text-5xl text-blue-500" />
          </div>

          <h2 className="text-center text-3xl font-bold text-gray-800 mb-2" data-aos="zoom-in">
            Create Your Account
          </h2>
          
          <p className="text-gray-500 text-center max-w-md">
            Enter your email and create a password
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
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                disabled={isLoading}
                className="pl-10 block w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
              />
            </div>
          </div>
          
          {/* Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaLock className="text-blue-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a secure password"
                required
                disabled={isLoading}
                className="pl-10 pr-10 block w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Password Requirements */}
            {formData.password.length > 0 && <PasswordRequirements />}
          </div>
          
          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaLock className="text-blue-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onPaste={handlePaste}
                ref={confirmPasswordRef}
                placeholder="Confirm your password"
                required
                disabled={isLoading}
                className="pl-10 pr-10 block w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {confirmPasted && (
              <p className="text-red-500 text-sm mt-1">
                Please type your password again manually. Pasting is not allowed.
              </p>
            )}
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
              disabled={isLoading || confirmPasted}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Register"
              )}
            </button>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-center mt-4">
            <a
              href="/"
              className="flex items-center text-blue-500 hover:text-blue-700 transition duration-300"
            >
              <FaArrowLeft className="mr-2" />
              Back to Homepage
            </a>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 font-bold hover:underline hover:text-blue-700 transition duration-300"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterCPE;