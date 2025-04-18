import React from "react";
import { FaArrowLeft } from "react-icons/fa";

export const RegisterFooter: React.FC = () => {
  return (
    <div className="mt-8">
      <div className="text-center mb-4">
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
      
      <div className="flex justify-center">
        <a
          href="/"
          className="flex items-center text-blue-500 hover:text-blue-700 transition duration-300"
        >
          <FaArrowLeft className="mr-2" />
          Back to Homepage
        </a>
      </div>
    </div>
  );
};
