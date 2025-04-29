
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

export const PasswordResetFooter: React.FC = () => {
  return (
    <div className="mt-8 text-center">
      <div className="flex justify-center mt-4">
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
