import React, { useState, useEffect, FormEvent } from "react";
import LoginForm from "../../components/login/LoginForm";
import TerminalAnimation from "../../components/login/TerminalAnimation";
import LogoDisplay from "../../components/login/LogoDisplay";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

// Define type for state
interface LoginState {
  visibleLines: { text: string; color: string }[];
  email: string;
  password: string;
  passwordVisible: boolean;
  error: string;
  isLoading: boolean;
  showImage: boolean;
}

const Login: React.FC = () => {
  const [state, setState] = useState<LoginState>({
    visibleLines: [],
    email: "",
    password: "",
    passwordVisible: false,
    error: "",
    isLoading: false,
    showImage: false,
  });

  const { login } = useAuth();

  const lines = [
    { text: "> Welcome to CPE KMUTT", color: "text-blue-500" },
    { text: "> Initializing login system...", color: "text-gray-600" },
    { text: "> Setting up secure connection...", color: "text-yellow-500" },
    { text: "> Authentication ready!", color: "text-green-500" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prevState: LoginState) => {
        const updatedLines = [...prevState.visibleLines, lines[prevState.visibleLines.length]];
        if (updatedLines.length === lines.length) {
          setTimeout(() => setState((prevState) => ({ ...prevState, showImage: true })), 800);
          clearInterval(interval);
        }
        return { ...prevState, visibleLines: updatedLines };
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const { email, password, isLoading } = state;
    if (isLoading) return;

    try {
      setState({ ...state, isLoading: true, error: "" });
      if (password.length < 6) {
        setState({ ...state, error: "Email must be valid and password must be at least 6 characters", isLoading: false });
        return;
      }
      await login(email, password);
      setState({ ...state, email: "", password: "", isLoading: false });
    } catch (err: any) {
      setState({ ...state, error: err.message || "Invalid email or password. Please try again.", isLoading: false });
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden w-full max-w-5xl relative z-10">
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Please sign in to your account</p>
          
          <LoginForm
            isLoading={state.isLoading}
            error={state.error}
            onSubmit={handleLogin}
            email={state.email}
            setEmail={(email) => setState({ ...state, email })}
            password={state.password}
            setPassword={(password) => setState({ ...state, password })}
            passwordVisible={state.passwordVisible}
            setPasswordVisible={(visible) => setState({ ...state, passwordVisible: visible })}
          />

          <div className="mt-4 flex items-center justify-center text-sm">
            <span className="text-gray-800">Back to</span>
            <Link 
              to="/" 
              className="text-blue-600 hover:text-blue-800 transition-colors font-semibold ml-1"
            >
              Homepage
            </Link>
          </div>
      
          
          {/* Add Register link */}
          <div className="mt-4 flex items-center justify-center text-sm">
            <span className="text-gray-800">Don't have an account?</span>
            <Link 
              to="/registry" 
              className="text-blue-600 hover:text-blue-800 transition-colors font-semibold ml-1"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-gray-900 p-8 flex flex-col items-center justify-center relative">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 flex items-center px-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-center w-full text-gray-400 text-xs font-mono">
              terminal - {state.showImage ? "display logo.png" : "login_system.js"}
            </div>
          </div>

          <div className="mt-8 w-full max-w-md">
            {state.showImage ? (
              <LogoDisplay logoUrl="/LogoCPE.png" />
            ) : (
              <TerminalAnimation visibleLines={state.visibleLines} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;