import React from "react";

type RegisterProgressProps = {
  step: number;
  totalSteps: number;
};

export const RegisterProgress: React.FC<RegisterProgressProps> = ({ step, totalSteps }) => {
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="relative w-full h-2 bg-gray-200 mb-8">
      <div 
        className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
