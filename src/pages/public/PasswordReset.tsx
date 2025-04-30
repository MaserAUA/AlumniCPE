import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";


import { AlumniRegistration, AlumniRegistrationFormData, PasswordResetFormData, PasswordStrength } from "../../models/registryCPE";

import { PasswordResetForm } from "../../components/PasswordReset/PasswordResetForm";
import { PasswordResetHeader } from "../../components/PasswordReset/PasswordResetHeader";
import { PasswordResetFooter } from "../../components/PasswordReset/PasswordResetFooter";

const PasswordReset: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PasswordResetFormData>({
    password: "",
    confirmPassword: "",
    token: searchParams.get('token') || "",
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const token = searchParams.get('token');
    
    if (!token) {
      navigate('/');
      return;
    }
    
    setFormData(prevData => ({
      ...prevData,
      token: token
    }));
  }, []);


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
        
        <PasswordResetHeader />
        <PasswordResetForm
          formData={formData}
          setFormData={setFormData}
        />
        <PasswordResetFooter />
      </div>
    </div>
  );
};

export default PasswordReset;
