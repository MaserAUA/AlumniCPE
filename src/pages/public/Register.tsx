import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import { formSteps } from "../../components/registry/formFields";
import { FormData } from "../../models/registry";
import { RegisterHeader } from "../../components/registry/RegisterHeader";
import { RegisterProgress } from "../../components/registry/RegisterProgress";
import { RegisterForm } from "../../components/registry/RegisterForm";
import { RegisterFooter } from "../../components/registry/RegisterFooter";

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = formSteps.length;
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState<FormData>({
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

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    // ... rest of the useEffect logic
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError("");

      // Call register from AuthContext with the complete form data
      // const success = await register(formData);

        
      setTimeout(() => {
        navigate('/homeuser');
      }, 2000);
      
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
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
        
        {/* Alumni RequestOTR text with link - similar to Sign In */}
        <div className="text-center mt-4 mb-2">
          <span className="text-gray-600">Alumni already have an account? </span>
          <Link 
            to="/RequestOTR" 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Request OTR
          </Link>
        </div>
        
        <RegisterProgress step={step} totalSteps={totalSteps} />

        <div className="px-6 py-4 sm:px-10 sm:py-8">
          <RegisterHeader step={step} totalSteps={totalSteps} />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <RegisterForm
              formData={formData}
              handleChange={handleChange}
              isLoading={isLoading}
              error={error}
              currentFields={formSteps[step - 1]}
            />

            <div className="flex justify-between pt-4 gap-4">
              {/* Navigation buttons */}
            </div>
          </form>

          <RegisterFooter />
        </div>
      </div>
    </div>
  );
};

export default Register;