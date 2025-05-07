import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { FormField, } from "../../models/formUtils";
import { UpdateUserFormData } from "../../models/user";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyAccount } from "../../api/auth";
import { useGetUserById } from "../../hooks/useUser"
import { useAuthContext } from "../../context/auth_context";

type RegisterFormProps = {
  formData: UpdateUserFormData;
  setFormData: Dispatch<SetStateAction<UpdateUserFormData>>;
  error: string;
  currentFields: FormField[];
};

export const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  setFormData,
  error,
  currentFields
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { userId, isAuthenticated, isLoading: isLoadingAuth } = useAuthContext()

  const { isLoading: isLoadingVerify } = useVerifyAccount(token, {enabled: !!token});
  const { data: userData, isLoading: isLoadingUser} = useGetUserById(userId, {enabled: !!userId})

  useEffect(() => {
    if (!userData && !isAuthenticated && !isLoadingAuth && !isLoadingVerify) {
      navigate('/');
      return;
    }
  }, [searchParams, navigate, isLoadingAuth, isLoadingVerify]);

useEffect(() => {
  if (userData) {
    const excludedKeys = new Set(["role", "username", "email"]);

    const flattenedData: Record<string, any> = {};

    Object.keys(userData).forEach((key) => {
      if (excludedKeys.has(key)) {
        return;
      }

      const value = (userData as any)[key];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        // Flatten one level deep
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          flattenedData[nestedKey] = nestedValue;
        });
      } else {
        flattenedData[key] = value;
      }
    });

    setFormData((prev) => ({
      ...prev,
      ...flattenedData,
    }));
  }
}, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        {currentFields.map((field, index) => (
          <div key={index} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            
            <div className="relative">
              {field.type === "select" ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {field.icon}
                  </div>
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className={`pl-10 block w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ${field.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={isLoadingVerify || isLoadingUser || field.disabled}
                    required={field.required}
                  >
                    <option key={0} value={""}></option>
                    {field.options?.map((option, idx) => (
                      <option key={idx+1} value={option.toLowerCase()}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {field.icon}
                  </div>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    disabled={isLoadingVerify || isLoadingUser || field.disabled}
                    className={`pl-10 block w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ${field.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg flex items-center" data-aos="fade-in">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};
