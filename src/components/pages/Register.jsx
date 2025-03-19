// At the top of your Register.jsx file, update the import statement to include FaArrowLeft
import React, { useEffect, useState } from "react";
import { FaUserEdit, FaUser, FaLock, FaEnvelope, FaPhone, FaIdCard, FaBook, FaArrowLeft } from "react-icons/fa";
import { BsBriefcase, BsBuilding, BsCurrencyDollar, BsGlobe } from "react-icons/bs";
import "aos/dist/aos.css";
import AOS from "aos";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../pages/AuthContext"; // Update path as needed

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    
    // Check if we're coming from email verification
    const fromEmailVerification = localStorage.getItem('fromEmailVerification');
    const tempEmail = localStorage.getItem('tempEmail');
    const tempPassword = localStorage.getItem('tempPassword');
    
    // If we have the email and password from RegisterCPE, pre-fill the form
    if (fromEmailVerification === 'true' && tempEmail && tempPassword) {
      setFormData(prev => ({
        ...prev,
        email: tempEmail,
        password: tempPassword,
      }));
      
      // Check if we need to fetch existing data (if available)
      if (tempEmail.includes('existing')) {
        // Mock fetching existing data for pre-filled form
        setTimeout(() => {
          setFormData(prev => ({
            ...prev,
            firstName: "John",
            lastName: "Doe",
            phoneNumber: "0891234567",
            studentID: "64070501000",
            cpeModel: "CPE35",
            nation: "Thailand",
            sex: "male",
            president: "no",
            // Other fields can be left empty
          }));
          
          Swal.fire({
            icon: "info",
            title: "Existing Data Loaded",
            text: "We've pre-filled some fields with your existing data. Please review and complete the registration.",
            timer: 3000,
          });
        }, 1500);
      }
    } else {
      // If we don't have email and password (not coming from RegisterCPE flow)
      // Redirect back to RegisterCPE
      navigate('/registercpe');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    phoneNumber: "",
    studentID: "",
    favoriteSubject: "",
    workingCompany: "",
    jobPosition: "",
    lineOfWork: "",
    cpeModel: "",
    salary: "",
    nation: "",
    sex: "",
    president: "",
  });

  const [error, setError] = useState("");

  // Form field groups organized by steps
  const formSteps = [
    // Step 1: Personal Information
    [
      { 
        label: "First name", 
        name: "firstName", 
        type: "text", 
        placeholder: "Enter your first name", 
        icon: <FaUser className="text-blue-400" />,
        required: true,
      },
      { 
        label: "Last name", 
        name: "lastName", 
        type: "text", 
        placeholder: "Enter your last name", 
        icon: <FaUser className="text-blue-400" />,
        required: true,
      },
      { 
        label: "Email", 
        name: "email", 
        type: "email", 
        placeholder: "your.email@example.com", 
        icon: <FaEnvelope className="text-blue-400" />,
        required: true,
        disabled: true, // Email should be read-only since it comes from RegisterCPE
      },
      { 
        label: "Password", 
        name: "password", 
        type: "password", 
        placeholder: "Create a secure password", 
        icon: <FaLock className="text-blue-400" />,
        required: true,
        disabled: true, // Password should be read-only since it comes from RegisterCPE
      },
      { 
        label: "Phone Number", 
        name: "phoneNumber", 
        type: "tel", 
        placeholder: "Enter your phone number", 
        icon: <FaPhone className="text-blue-400" />,
        required: true,
      },
      { 
        label: "Sex", 
        name: "sex", 
        type: "select", 
        options: ["Select", "Male", "Female", "Prefer not to say"],
        icon: <FaUser className="text-blue-400" />,
        required: true,
      },
    ],
    // Step 2: Educational Information
    [
      { 
        label: "Student ID", 
        name: "studentID", 
        type: "text", 
        placeholder: "Enter your student ID", 
        icon: <FaIdCard className="text-blue-400" />,
        required: true,
      },
      { 
        label: "CPE Model", 
        name: "cpeModel", 
        type: "text", 
        placeholder: "e.g., CPE35", 
        icon: <FaIdCard className="text-blue-400" />,
        required: true,
      },
      { 
        label: "Favorite subject", 
        name: "favoriteSubject", 
        type: "text", 
        placeholder: "What subject do you enjoy most?", 
        icon: <FaBook className="text-blue-400" />,
        required: false,
      },
      { 
        label: "Nation", 
        name: "nation", 
        type: "text", 
        placeholder: "Your nationality", 
        icon: <BsGlobe className="text-blue-400" />,
        required: true,
      },
      { 
        label: "President?", 
        name: "president", 
        type: "select", 
        options: ["Select", "Yes", "No"],
        icon: <FaUser className="text-blue-400" />,
        required: true,
      },
    ],
    // Step 3: Professional Information
    [
      { 
        label: "Working company", 
        name: "workingCompany", 
        type: "text", 
        placeholder: "Current or previous company", 
        icon: <BsBuilding className="text-blue-400" />,
        required: false,
      },
      { 
        label: "Job position", 
        name: "jobPosition", 
        type: "text", 
        placeholder: "Your job title", 
        icon: <BsBriefcase className="text-blue-400" />,
        required: false,
      },
      { 
        label: "Line of work", 
        name: "lineOfWork", 
        type: "text", 
        placeholder: "Field or industry", 
        icon: <BsBriefcase className="text-blue-400" />,
        required: false,
      },
      { 
        label: "Salary", 
        name: "salary", 
        type: "text", 
        placeholder: "Your current salary (optional)", 
        icon: <BsCurrencyDollar className="text-blue-400" />,
        required: false,
      },
    ]
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setError(""); // Clear error when user types
  };

  const nextStep = () => {
    // Validate current step fields
    const currentFields = formSteps[step - 1];
    const requiredFields = currentFields.filter(field => field.required);
    
    for (const field of requiredFields) {
      if (!formData[field.name]) {
        setError(`Please fill in the ${field.label} field`);
        return;
      }
    }
    
    setError("");
    setStep(prev => Math.min(prev + 1, totalSteps));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    setError("");
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError("");

      // Call register from AuthContext with the complete form data
      const success = await register(formData);

      if (success) {
        // Registration successful, clean up localStorage
        localStorage.removeItem('tempEmail');
        localStorage.removeItem('tempPassword');
        localStorage.removeItem('fromEmailVerification');
        
        setTimeout(() => {
          navigate('/homeuser');
        }, 2000);
      } else {
        setError("Registration failed. Please try again.");
        setIsLoading(false);
      }
      
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

  // Progress bar calculation
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-5 font-inter">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div
        className="bg-white rounded-3xl shadow-2xl sm:p-2 w-full max-w-4xl relative overflow-hidden"
        data-aos="fade-up"
      >
        {/* Top decoration */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
        
        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-gray-200 mb-8">
          <div 
            className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="px-6 py-4 sm:px-10 sm:py-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-50 p-4 rounded-full mb-4 hover:scale-110 transition-transform duration-500 shadow-md">
              <FaUserEdit className="text-5xl text-blue-500" />
            </div>

            <h2 className="text-center text-3xl font-bold text-gray-800 mb-2" data-aos="zoom-in">
              Complete Your Profile
            </h2>
            
            <p className="text-gray-500 text-center max-w-md mb-4">
              Step {step} of {totalSteps}: {step === 1 ? 'Personal Information' : step === 2 ? 'Educational Details' : 'Professional Background'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {formSteps[step - 1].map((field, index) => (
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
                          {field.options.map((option, idx) => (
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

            <div className="flex justify-between pt-4 gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition duration-300"
                >
                  Back
                </button>
              )}
              
              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none px-6 py-3 ml-auto bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-lg"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 sm:flex-none px-6 py-3 ml-auto bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                      Registering...
                    </div>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="mt-8">
            <div className="text-center mb-4">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-500 font-bold hover:underline hover:text-blue-700 transition duration-300"
                >
                  Sign In
                </a>
              </p>
            </div>
            
            <div className="flex justify-center">
              <a
                href="/"
                className="flex items-center text-blue-500 hover:text-blue-700 transition duration-300"
              >
                <FaArrowLeft className="mr-2" />
                Back to Homepage
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;