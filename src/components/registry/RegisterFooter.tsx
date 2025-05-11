import React from "react";
import { FaArrowLeft } from "react-icons/fa";

export const RegisterFooter: React.FC = () => {
  return (
    <div className="mt-8">
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
