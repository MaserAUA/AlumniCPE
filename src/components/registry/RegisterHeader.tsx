import React from "react";
import { FaUserEdit } from "react-icons/fa";

type RegisterHeaderProps = {
  step: number;
  totalSteps: number;
};

export const RegisterHeader: React.FC<RegisterHeaderProps> = ({ step, totalSteps }) => {
  const getStepTitle = (): string => {
    switch(step) {
      case 1: return 'Personal Information';
      case 2: return 'Educational Details';
      case 3: return 'Professional Background';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="bg-blue-50 p-4 rounded-full mb-4 hover:scale-110 transition-transform duration-500 shadow-md">
        <FaUserEdit className="text-5xl text-blue-500" />
      </div>

      <h2 className="text-center text-3xl font-bold text-gray-800 mb-2" data-aos="zoom-in">
        Complete Your Profile
      </h2>
      
      <p className="text-gray-500 text-center max-w-md mb-4">
        Step {step} of {totalSteps}: {getStepTitle()}
      </p>
    </div>
  );
};
