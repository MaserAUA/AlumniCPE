import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import { RequestOTRFormHeader } from "../../components/registrycpe/RequestOTRFormHeader";
import { RequestOTRFrom } from "../../components/registrycpe/RequestOTRForm";
import { RegisterCPEFooter } from "../../components/registrycpe/RegisterCPEFooter";
import { useAuth } from "../../hooks/useAuth";
import { OTR } from "../../models/registryCPE";

const RequestOTR: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OTR>({
    email: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { requestOTR } = useAuth()
  
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError("");
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Validate form
    if (!formData.email) {
      setError("All fields are required");
      return;
    }

    if (!formData.email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }


    try {
      setIsLoading(true);
      setError("");

      await requestOTR(formData.email)
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
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden"
        data-aos="fade-up"
      >
        {/* Top decoration */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
        <RequestOTRFormHeader />
        <RequestOTRFrom
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
        <RegisterCPEFooter />
      </div>
    </div>
  );
};

export default RequestOTR;
