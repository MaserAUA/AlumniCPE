import React from "react";

const Page404 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-60 animate-pulse delay-700" />
      </div>

      {/* Main content */}
      <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-12 max-w-lg w-full mx-4 transform hover:scale-105 transition-transform duration-300">
        {/* 404 number with animation */}
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-center">
            <span className="bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent animate-pulse">
              404
            </span>
          </h1>
          
          {/* Decorative lines */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 bg-white rounded-full border-2 border-gray-200" />
        </div>

        {/* Error messages */}
        <div className="mt-8 text-center space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
            Oops! Page not found
          </h2>
          <p className="text-gray-600">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg 
              className="w-5 h-5 mr-2 transform rotate-180" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 5l7 7-7 7M5 5l7 7-7 7" 
              />
            </svg>
            Return to Homepage
          </a>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
      </div>
    </div>
  );
};

export default Page404;