import React, { useState } from "react";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = ({ isLoading, error, onSubmit, email, setEmail, password, setPassword, passwordVisible, setPasswordVisible }) => (
  <form className="space-y-6" onSubmit={onSubmit}>
    {/* Email Input */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 block"> Email Address </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaEnvelope className="h-5 w-5 text-gray-400" />
        </div>
        <input
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="pl-10 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          required
          autoComplete="email"
          disabled={isLoading}
        />
      </div>
    </div>
    
    {/* Password Input */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex justify-between">
        <span>Password</span>
        <a href="/forgot_password" className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
          Forgot password?
        </a>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaLock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={passwordVisible ? "text" : "password"}
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="pl-10 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          required
          autoComplete="current-password"
          disabled={isLoading}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="text-gray-500 hover:text-blue-500 focus:outline-none transition-colors"
            disabled={isLoading}
          >
            {passwordVisible ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>

    {error && (
      <div className="bg-red-50 text-red-500 p-3 rounded-lg flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    )}

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300
        ${!isLoading && "hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5"}
        ${isLoading && "opacity-80 cursor-not-allowed"}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
          Signing in...
        </div>
      ) : (
        "Sign In"
      )}
    </button>
  </form>
);

export default LoginForm;
