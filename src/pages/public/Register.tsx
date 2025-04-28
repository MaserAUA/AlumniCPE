import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import { formSteps } from "../../models/formFields";
import { UpdateUserFormData } from "../../models/user";
import { RegisterHeader } from "../../components/registry/RegisterHeader";
import { RegisterProgress } from "../../components/registry/RegisterProgress";
import { RegisterForm } from "../../components/registry/RegisterForm";
import { RegisterFooter } from "../../components/registry/RegisterFooter";
import { useUpdateUserById } from "../../hooks/useUser"

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = formSteps.length;
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<UpdateUserFormData>({
    first_name: "",
    last_name: "",
    first_name_eng: "",
    last_name_eng: "",
    gender: "male",
    profile_picture: "",
    student_id: "",
    generation: "",
    admit_year: "",
    graduate_year: "",
    gpax: "",
    phone: "",
    email: "",
    github: "",
    linkedin: "",
    facebook: "",
  });
  const updateUserByIdMutation = useUpdateUserById()

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);


  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    const currentFields = formSteps[step - 1];
    const requiredFields = currentFields.filter(field => field.required);

    for (const field of requiredFields) {
      if (!formData[field.name]) {
        setError(`Please fill in the ${field.label} field`);
        return;
      }
    }
    setError("");
    setStep(prev => Math.min(prev + 1, totalSteps+1));
    window.scrollTo(0, 0);
  };

  const prevStep = (e: React.FormEvent) => {
    e.preventDefault();
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
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== "")
      );
      updateUserByIdMutation.mutate(cleanedFormData);
      setTimeout(() => {
        navigate('/homeuser');
      }, 1000);
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

        <RegisterProgress step={step} totalSteps={totalSteps} />

        <div className="px-6 py-4 sm:px-10 sm:py-8">
          <RegisterHeader step={step} totalSteps={totalSteps} />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <RegisterForm
              formData={formData}
              setFormData={setFormData}
              // isLoading={isLoading}
              error={error}
              currentFields={formSteps[step - 1]}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                  disabled={isLoading}
                >
                  Previous
                </button>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  disabled={isLoading}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="ml-auto bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>

          </form>

          <RegisterFooter />
        </div>
      </div>
    </div>
  );
};

export default Register;
