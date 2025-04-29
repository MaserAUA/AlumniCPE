
import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { PasswordRequirements } from "../common/PasswordRequirements";
import { PasswordStrength, PasswordResetFormData } from "../../models/registryCPE";
import Swal from "sweetalert2";
import { useResetPasswordConfirm } from "../../api/auth";

export interface PasswordResetFormProps {
  formData: PasswordResetFormData;
  setFormData: Dispatch<SetStateAction<PasswordResetFormData>>;
}
export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  formData,
  setFormData,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasted, setConfirmPasted] = useState(false);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const resetPasswordConfirm = useResetPasswordConfirm()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError("");

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Validate form
    if (!formData.password || !formData.confirmPassword) {
      setError("All fields are required");
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
      resetPasswordConfirm.mutate(formData)
      setIsLoading(false);
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Registration Error",
        text: "An unexpected error occurred. Please try again later.",
      });
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
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
        {formData.password.length > 0 && (
          <PasswordRequirements passwordStrength={passwordStrength} />
        )}
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
            // onPaste={handlePaste}
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
    </form>
  );
};
