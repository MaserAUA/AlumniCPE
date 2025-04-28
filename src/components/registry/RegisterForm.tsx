import React, { useState, useEffect } from "react";
import { FormField, UpdateUserFormData } from "../../models/registry";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyAccount } from "../../api/auth";

type RegisterFormProps = {
  formData: UpdateUserFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  // isLoading: boolean;
  error: string;
  currentFields: FormField[];
};

export const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  handleChange,
  // isLoading,
  error,
  currentFields
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const {data, isLoading} = useVerifyAccount(token || "");

  useEffect(() => {
    if (!token && !isLoading) {
      navigate('/');
      return;
    }

  }, [searchParams, navigate, data]);


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
                    disabled={isLoading || field.disabled}
                    required={field.required}
                  >
                    {field.options?.map((option, idx) => (
                      <option key={idx} value={option === "Select" ? "" : option.toLowerCase()}>
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
                    disabled={isLoading || field.disabled}
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
