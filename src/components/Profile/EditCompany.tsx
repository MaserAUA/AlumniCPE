import React, { FC, useState, useEffect, Dispatch, SetStateAction } from "react";
import { FormField } from '../../models/formUtils'
import { UpdateUserFormData } from "../../models/user";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from 'sweetalert2';
import {
  FaBuilding
} from "react-icons/fa";
// import { useGetCompanyName } from "../../hooks/useSearch";
import { getCompanyName } from "../../api/search";
import { useDebounce } from "../../hooks/useDebounce";
import { useGetCompanyName } from "../../hooks/useSearch";
import { useAddUserCompany, useDeleteUserCompany } from "../../hooks/useCompany";
import { UserCompany } from "../../models/company";
import { useAuthContext } from "../../context/auth_context";

interface Props {
  formData: UpdateUserFormData;
  setError: Dispatch<SetStateAction<string>>;
  error: string;
}

export const EditCompany: FC<Props> = ({
  formData,
  setError,
  error,
}) => {
  const { userId, isLoading: isLoadingAuth } = useAuthContext()
  const [compForm, setCompForm] = useState<UserCompany>({
    user_id: userId || "",
    company: "",
    position: "",
    salary_min: "0",
    salary_max: "0",
  })
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 300)
  const {data: suggestions, isLoading: isLoadingSuggest} = useGetCompanyName(debouncedQuery)
  const addUserCompany = useAddUserCompany()
  const deleteUserCompany = useDeleteUserCompany()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    setQuery(e.target.value);
    setShowSuggestions(true)
  };

  const selectSuggestion = (company: string) => {
    const fakeEvent = {
      target: {
        name: "company",
        value: company,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(fakeEvent);
    setQuery(company);
    setShowSuggestions(false);
  };

  const handleDelete = async (company: UserCompany) => {
    company.user_id = userId || ""
    try {
      setIsLoading(true);
      deleteUserCompany.mutate(company, {
        onSuccess(data, variables, context) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Delete company successfully',
            timer: 1000,
            showConfirmButton: false
          });
          setError("")
        },
        onError(error, variables, context) {
          console.error(error)
          setError(error.message)
        },
      })
      setIsLoading(false);
    } catch (err) {
      console.error("Add Error", err);
      setIsLoading(false);
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true);
      addUserCompany.mutate(compForm, {
        onSuccess(data, variables, context) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Add updated successfully',
            timer: 1000,
            showConfirmButton: false
          });
          setError("")
        },
        onError(error, variables, context) {
          console.error(error)
          setError(error.message)
        },
      })
      setIsLoading(false);
    } catch (err) {
      console.error("Add Error", err);
      setIsLoading(false);
    }
  }

  return (
  <>
    {formData.companies && formData.companies.length > 0 && (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Companies</h3>
        <ul className="space-y-3">
          {formData.companies.map((company, index) => (
            <li
              key={index}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {company.company} — {company.position}
                </p>
                <p className="text-sm text-gray-500">
                  Salary: ${company.salary_min} - ${company.salary_max}
                </p>
              </div>
              <button
                onClick={() => handleDelete(company)}
                className="mt-2 sm:mt-0 px-4 py-1.5 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-8 gap-y-6 mb-32">
      <div key={0} className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Company Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaBuilding className="text-blue-400"/>
              </div>
              <input
                type="text"
                name="company"
                value={query || ""}
                onChange={onInputChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 50)}
                placeholder="company"
                required={true}
                className="pl-10 block w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
              />
              {showSuggestions && !isLoadingSuggest && suggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 h-40 w-full overflow-y-auto">
                {[...suggestions]
                  .sort((a, b) => b.score - a.score)
                  .map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onMouseDown={() => selectSuggestion(suggestion.name)}
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
        </div>
      </div>
      <div key={1} className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Position <span className="text-red-500">*</span>
        </label>
        <div className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaBuilding className="text-blue-400"/>
              </div>
              <input
                type="text"
                name="position"
                value={compForm["position"] || ""}
                onChange={handleChange}
                placeholder="position"
                required={true}
                className={`pl-10 block w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300`}
              />
            </div>
        </div>
      </div>
      <div key={2} className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Range Salary (min)
        </label>
        <div className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaBuilding className="text-blue-400"/>
              </div>
              <input
                type="number"
                name="salary_min"
                value={compForm["salary_min"] || 0}
                min={0}
                max={compForm["salary_max"]}
                step={1000}
                onChange={handleChange}
                className={`pl-10 block w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300`}
              />
            </div>
        </div>
      </div>
      <div key={3} className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Range Salary (max)
        </label>
        <div className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaBuilding className="text-blue-400"/>
              </div>
              <input
                type="number"
                name="salary_max"
                value={compForm["salary_max"] || 0}
                min={compForm["salary_min"]}
                step={1000}
                onChange={handleChange}
                className={`pl-10 block w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300`}
              />
            </div>
        </div>
      </div>
    </div>
    {error &&
      <div className="bg-red-50 text-red-500 p-3 rounded-lg flex items-center" data-aos="fade-in">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    }
    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-100">
      <button
        onClick={()=>handleSave()}
        disabled={isLoading || isLoadingAuth}
        className={`px-8 py-2.5 rounded-lg bg-blue-600 text-white font-medium transition-colors ${
          !isLoading
            ? "hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            : "opacity-50 cursor-not-allowed"
        } flex items-center justify-center`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        ) : (
          "Add Company"
        )}
      </button>
    </div>
  </>
)};
