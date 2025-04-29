import React, { FC, useState, useEffect, Dispatch, SetStateAction } from "react";
import { FormField } from '../../models/formUtils'
import { UpdateUserFormData } from "../../models/user";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Props {
  formData: UpdateUserFormData;
  // setFormData: Dispatch<SetStateAction<UpdateUserFormData>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>void
  currentFields: FormField[];
}

export const EditProfileForm: FC<Props> = ({
  formData,
  // setFormData,
  handleChange,
  currentFields
}) => {


  return (
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
                disabled={ field.disabled}
                className={`pl-10 block w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ${field.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>
          )}
        </div>
      </div>
      // <div key={key} className="mb-4">
      //   <label className="block text-sm font-medium text-gray-700">{label}</label>
      //   <input
      //     type="text"
      //     name={key}
      //     value={values[key] || ''}
      //     onChange={(e) => onChange(key, e.target.value)}
      //     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
      //   />
      // </div>
    ))}
  </div>
)};
