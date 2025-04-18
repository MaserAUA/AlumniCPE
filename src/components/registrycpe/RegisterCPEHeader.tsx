import React from "react";
import { FaUserEdit } from "react-icons/fa";

export const RegisterCPEHeader: React.FC = () => {
  return (
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
  );
};
