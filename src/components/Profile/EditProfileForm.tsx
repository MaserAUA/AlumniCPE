import React, { FC, useState, useEffect, Dispatch, SetStateAction } from "react";
import { FormField } from '../../models/formUtils'
import { UpdateUserFormData } from "../../models/user";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Props {
  formData: UpdateUserFormData;
  // setFormData: Dispatch<SetStateAction<UpdateUserFormData>>;
  error: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>void
  currentFields: FormField[];
}

export const EditProfileForm: FC<Props> = ({
  formData,
  // setFormData,
  error,
  handleChange,
  currentFields
}) => {

  return (
  <>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-8 gap-y-6">
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
                disabled={ field.disabled}
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
                disabled={field.disabled}
                min={field.min}
                max={field.max}
                step={field.step}
                className={`pl-10 block w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ${field.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
    {error &&
      <div className="bg-red-50 text-red-500 p-3 rounded-lg flex items-center" data-aos="fade-in">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    }
  </>
)};
