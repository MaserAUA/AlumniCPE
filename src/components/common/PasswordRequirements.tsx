import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { PasswordStrength } from "../../models/registryCPE";

type PasswordRequirementsProps = {
  passwordStrength: PasswordStrength;
};

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ passwordStrength }) => {
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
