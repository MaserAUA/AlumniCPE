import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import { useSearchParams } from 'react-router-dom';
import { RegisterCPEHeader } from "../../components/registrycpe/RegisterCPEHeader";
import { RegisterCPEForm } from "../../components/registrycpe/RegisterCPEForm";
import { RegisterCPEFooter } from "../../components/registrycpe/RegisterCPEFooter";
import { AlumniRegistration, AlumniRegistrationFormData, PasswordStrength } from "../../models/registryCPE";
import { useAuth } from "../../hooks/useAuth";

const RegisterCPE: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AlumniRegistrationFormData>({
    username: "",
    password: "",
    confirmPassword: "",
    token: searchParams.get('token') || "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [confirmPasted, setConfirmPasted] = useState(false);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { registerAlumni } = useAuth();
  
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const token = searchParams.get('token');
    
    // If token is empty or not provided, navigate to home
    if (!token) {
      navigate('/'); // Navigate to home page
      return; // Exit early
    }
    
    // Set the token in form data
    setFormData(prevData => ({
      ...prevData,
      token: token
    }));
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError("");

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    });
  };

  // const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  //   e.preventDefault();
  //   setConfirmPasted(true);
  //   setTimeout(() => setConfirmPasted(false), 3000);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Validate form
    if (!formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!passwordStrength.hasMinLength || 
        !passwordStrength.hasUpperCase || 
        !passwordStrength.hasLowerCase || 
        !passwordStrength.hasNumber || 
        !passwordStrength.hasSpecialChar) {
      setError("Password does not meet all requirements");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await registerAlumni(
        formData.token,
        formData.username,
        formData.password
      )
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
        
        <RegisterCPEHeader />
        
        <RegisterCPEForm
          formData={formData}
          handleChange={handleChange}
          // handlePaste={handlePaste}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
          passwordStrength={passwordStrength}
          confirmPasted={confirmPasted}
          confirmPasswordRef={confirmPasswordRef}
        />

        <RegisterCPEFooter />
      </div>
    </div>
  );
};

export default RegisterCPE;
