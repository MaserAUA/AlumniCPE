import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaEye, FaEyeSlash, FaLock, FaEnvelope, FaArrowLeft, FaHome } from "react-icons/fa";
import VanillaTilt from "vanilla-tilt";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import { useAuth } from "../../auth/AuthContext";

const Login = () => {
  const [visibleLines, setVisibleLines] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const tiltRef = useRef(null);
  
  // ใช้ useAuth hook จาก AuthContext
  const { login } = useAuth();

  const lines = [
    { text: "> Welcome to CPE KMUTT", color: "text-blue-500" },
    { text: "> Initializing login system...", color: "text-gray-600" },
    { text: "> Setting up secure connection...", color: "text-yellow-500" },
    { text: "> Authentication ready!", color: "text-green-500" },
  ];

  // Effect for AOS initialization
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  // Effect for VanillaTilt
  useEffect(() => {
    if (showImage && tiltRef.current && imageLoaded) {
      VanillaTilt.init(tiltRef.current, {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.3,
        scale: 1.05,
      });
    }

    return () => {
      if (tiltRef.current && tiltRef.current.vanillaTilt) {
        tiltRef.current.vanillaTilt.destroy();
      }
    };
  }, [showImage, imageLoaded]);

  // Effect for terminal animation
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prevLines) => {
        if (prevLines.length === lines.length) {
          setTimeout(() => setShowImage(true), 800);
          clearInterval(interval);
          return prevLines;
        }
        return [...prevLines, lines[prevLines.length]];
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError("");

      // Validate email format and password length (basic validation)
      if (!email.includes('@') || password.length < 6) {
        setError("Email must be valid and password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      // ใช้ login จาก AuthContext
      const success = await login(email, password);

      if (success) {
        // ล้างข้อมูลฟอร์ม
        setEmail("");
        setPassword("");
      } else {
        setError("Invalid email or password. Please try again.");
        // Swal alert จะถูกเรียกจาก AuthContext แล้ว
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, setter) => {
    setError(""); // Clear error when user types
    setter(e.target.value);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error("Failed to load logo image");
    // Fallback solution if image fails to load
    setImageLoaded(true); // Still trigger tilt effect
  };

  // Default logo URL with fallback
  const logoUrl = "/LogoCPE.png";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Animated particles */}
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

      {/* No floating button */}

      <div
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden w-full max-w-5xl relative z-10"
        data-aos="fade-up"
      >
        {/* Left Section - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-50 rounded-full mb-4 shadow-md">
              <FaUser className="text-5xl text-blue-500 transition-all duration-500 hover:text-blue-600 hover:scale-110" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2">Please sign in to your account</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => handleInputChange(e, setEmail)}
                  placeholder="you@example.com"
                  className="pl-10 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex justify-between">
                <span>Password</span>
                <a href="/forgotpassword" className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
                  Forgot password?
                </a>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => handleInputChange(e, setPassword)}
                  placeholder="••••••••"
                  className="pl-10 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="text-gray-500 hover:text-blue-500 focus:outline-none transition-colors"
                    disabled={isLoading}
                  >
                    {passwordVisible ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg flex items-center" data-aos="fade-in">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300
                ${!isLoading && "hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5"}
                ${isLoading && "opacity-80 cursor-not-allowed"}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center text-gray-600 mb-4">
              Don't have an account?{" "}
              <a
                href="/registercpe"
                className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
              >
                Create account
              </a>
            </div>
            
            <div className="flex justify-center mt-2">
              <a
                href="/"
                className="flex items-center text-blue-500 hover:text-blue-700 transition duration-300"
              >
                <FaArrowLeft className="mr-2" />
                Back to Homepage
              </a>
            </div>
          </form>
        </div>

        {/* Right Section - Terminal or Logo */}
        <div
          className="w-full md:w-1/2 bg-gray-900 p-8 flex flex-col items-center justify-center relative"
          data-aos="fade-left"
        >
          <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 flex items-center px-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-center w-full text-gray-400 text-xs font-mono">
              terminal - {showImage ? "display logo.png" : "login_system.js"}
            </div>
          </div>

          <div className="mt-8 w-full max-w-md">
            {showImage ? (
              <div 
                ref={tiltRef} 
                className="bg-blue-50/10 p-8 rounded-xl shadow-lg transform transition-all duration-500"
                data-aos="zoom-in"
              >
                {/* Placeholder element to maintain layout while real image loads */}
                <div 
                  className={`w-full aspect-square flex items-center justify-center bg-gray-800 rounded ${!imageLoaded ? 'block' : 'hidden'}`}
                >
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                
                <img
                  src={logoUrl}
                  alt="CPE KMUTT Logo"
                  className={`w-full object-contain ${imageLoaded ? 'block' : 'hidden'}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                
                {/* Fallback content if image fails */}
                {!imageLoaded && 
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-blue-400 font-bold text-2xl">CPE</div>
                  </div>
                }
                
                <div className="text-center mt-6">
                  <div className="text-blue-400 font-medium text-lg">KMUTT Computer Engineering</div>
                  <div className="text-gray-500 text-sm mt-1">King Mongkut's University of Technology Thonburi</div>
                </div>
              </div>
            ) : (
              <div className="font-mono text-sm h-64 overflow-auto w-full terminal-container" data-aos="fade-up">
                <div className="text-green-400 mb-4"># CPE KMUTT Authentication System</div>
                <div className="space-y-3">
                  {visibleLines.map((line, index) => (
                    <div key={index} className="flex">
                      <span className={`${line.color}`}>{line.text}</span>
                      {index === visibleLines.length - 1 && (
                        <span className="animate-pulse ml-1">_</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom animation for floating particles */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
        .terminal-container::-webkit-scrollbar {
          width: 8px;
        }
        .terminal-container::-webkit-scrollbar-track {
          background: #1a202c;
        }
        .terminal-container::-webkit-scrollbar-thumb {
          background-color: #2d3748;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Login;