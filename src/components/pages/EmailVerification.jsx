import React, { useState, useEffect } from "react";
import { FaUserCheck, FaArrowLeft, FaCheck, FaUserPlus, FaHistory } from "react-icons/fa";
import "aos/dist/aos.css";
import AOS from "aos";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const EmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailExists, setEmailExists] = useState(null);
  const [showExistingDataOptions, setShowExistingDataOptions] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    
    // ใช้ API Verify Account เพื่อดึงข้อมูลจาก session (HTTP-only cookies)
    const fetchSessionData = async () => {
      try {
        // ใช้ GET Verify Account เพื่อตรวจสอบ session
        const response = await fetch("https://alumni-api.fly.dev/v1/auth/verify-account", {
          method: "GET",
          credentials: "include", // สำคัญมาก - ส่ง cookies ไปด้วย
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to verify account");
        }

        const data = await response.json();
        
        if (data.email) {
          setEmail(data.email);
          // ตรวจสอบอีเมลโดยอัตโนมัติเมื่อคอมโพเนนต์ถูกโหลด
          checkEmailExists(null, data.email);
        } else {
          // ถ้าไม่มีอีเมลใน session, กลับไปที่หน้าลงทะเบียน
          navigate('/registercpe');
        }
      } catch (err) {
        console.error("Session data error:", err);
        setError("Could not retrieve your session. Please try again.");
        navigate('/registercpe');
      }
    };

    fetchSessionData();
  }, [navigate]);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
    // รีเซ็ต state เมื่ออีเมลมีการเปลี่ยนแปลง
    setEmailExists(null);
    setShowExistingDataOptions(false);
  };

  const checkEmailExists = async (e, emailToCheck = null) => {
    if (e) e.preventDefault();
    if (isChecking) return;

    // ใช้พารามิเตอร์อีเมลที่ส่งมาหรือค่า state
    const emailValue = emailToCheck || email;

    // ตรวจสอบอีเมล
    if (!emailValue) {
      setError("Email is required");
      return;
    }

    if (!emailValue.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsChecking(true);
      setError("");

      // เปลี่ยนเป็นใช้ endpoint ใหม่
      const response = await fetch("https://alumni-api.fly.dev/v1/auth/check-email", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: emailValue })
      });

      const result = await response.json();
      
      // ปรับตามรูปแบบการตอบกลับของ API
      const exists = response.status === 409 || result.exists === true || result.status === "email_exists";
      
      setEmailExists(exists);
      setShowExistingDataOptions(exists);
      
    } catch (err) {
      console.error("Email check error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleUseExistingData = async () => {
    setIsLoading(true);
    
    try {
      // เปลี่ยนเป็นใช้ endpoint ใหม่
      const response = await fetch("https://alumni-api.fly.dev/v1/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          email: email,
          // รหัสผ่านจะถูกดึงมาจาก session cookie ที่เซิร์ฟเวอร์
          useSessionPassword: true 
        })
      });

      if (!response.ok) {
        throw new Error("Failed to use existing data");
      }

      setIsLoading(false);
      setShowSuccessPopup(true);
      
    } catch (err) {
      console.error("Use existing data error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleCreateNewData = async () => {
    try {
      // อัพเดตเซิร์ฟเวอร์ว่าเราต้องการสร้างข้อมูลใหม่
      await fetch("https://alumni-api.fly.dev/v1/auth/set-create-new", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ createNew: true })
      });
      
      // นำทางไปที่หน้าลงทะเบียน
      navigate("/register");
      
    } catch (err) {
      console.error("Navigation error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    // นำทางไปยังหน้าหลัก
    navigate("/homeuser");
  };

  // คอมโพเนนต์แสดงป๊อปอัพสำเร็จ
  const SuccessPopup = ({ onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* พื้นหลังโปร่งใส */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* การ์ดป๊อปอัพ */}
        <div 
          className="bg-white rounded-lg shadow-2xl w-11/12 max-w-md relative z-10 pb-6 mx-4"
          data-aos="zoom-in"
        >
          {/* วงกลมพร้อมเครื่องหมายถูกที่ทับด้านบน */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 rounded-full bg-green-100 border-4 border-white flex items-center justify-center">
              <FaCheck className="text-3xl text-green-500" />
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center pt-16 px-6">
            <h3 className="text-2xl font-bold text-green-500 mb-4">
              Success!
            </h3>
            
            <div className="mb-6 w-full">
              <p className="text-gray-700 mb-3">
                Your account is now ready. You're being redirected to your dashboard.
              </p>
              
              <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
                <div className="absolute top-0 left-0 h-full bg-green-500 animate-pulse-width"></div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition duration-300 shadow-md"
            >
              <FaCheck className="inline mr-2" />
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleNavigateToRegisterCPE = (e) => {
    e.preventDefault();
    navigate("/registercpe");
  };

  const handleNavigateToHome = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-5 font-inter">
      {/* พื้นหลังแอนิเมชัน */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden"
        data-aos="fade-up"
      >
        {/* ตกแต่งด้านบน */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-50 p-4 rounded-full mb-4 hover:scale-110 transition-transform duration-500 shadow-md">
            <FaUserCheck className="text-5xl text-blue-500" />
          </div>

          <h2 className="text-center text-3xl font-bold text-gray-800 mb-2" data-aos="zoom-in">
            Account Verification
          </h2>
          
          <p className="text-gray-500 text-center max-w-md">
            Checking if you already have an account
          </p>
        </div>

        <div className="space-y-6">
          {/* แสดงอีเมล - อ่านอย่างเดียว */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Your Email
            </label>
            <div className="relative">
              <div className="p-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg">
                {email}
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

          {/* แสดงผลการตรวจสอบอีเมล */}
          {emailExists !== null && !error && (
            <div 
              className={`p-4 rounded-lg ${emailExists ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'}`}
              data-aos="fade-in"
            >
              {emailExists ? (
                <p>
                  <span className="font-bold">This email already exists in our system.</span> You can use your existing data or create a new profile.
                </p>
              ) : (
                <p>
                  <span className="font-bold">This email is not registered.</span> Please proceed to create a new account.
                </p>
              )}
            </div>
          )}

          {/* ตัวแสดงสถานะกำลังตรวจสอบอีเมล */}
          {isChecking && (
            <div className="flex justify-center items-center py-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-blue-600">Checking email status...</span>
            </div>
          )}

          {/* ตัวเลือกสำหรับอีเมลที่มีอยู่แล้ว */}
          {showExistingDataOptions && (
            <div className="space-y-3 pt-2" data-aos="fade-up">
              <button
                type="button"
                onClick={handleUseExistingData}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg font-medium hover:from-green-500 hover:to-green-700 transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <FaHistory className="mr-2" />
                    Use Existing Data
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCreateNewData}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-white border border-blue-500 text-blue-500 rounded-lg font-medium hover:bg-blue-50 transition duration-300"
              >
                <FaUserPlus className="inline mr-2" />
                Create New Data
              </button>
            </div>
          )}
          
          {/* ตัวเลือกสำหรับอีเมลใหม่ */}
          {emailExists === false && (
            <div className="pt-2" data-aos="fade-up">
              <button
                type="button"
                onClick={handleCreateNewData}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-lg"
              >
                <FaUserPlus className="inline mr-2" />
                Proceed to Registration
              </button>
            </div>
          )}
          
          {/* ปุ่มนำทาง */}
          <div className="flex justify-between mt-4">
            <button
              onClick={handleNavigateToRegisterCPE}
              className="flex items-center text-blue-500 hover:text-blue-700 transition duration-300"
            >
              <FaArrowLeft className="mr-2" />
              Back to Email Registration
            </button>
            
            <button
              onClick={handleNavigateToHome}
              className="flex items-center text-blue-500 hover:text-blue-700 transition duration-300"
            >
              <FaArrowLeft className="mr-2" />
              Back to Homepage
            </button>
          </div>
        </div>

        {/* ป๊อปอัพสำเร็จ */}
        {showSuccessPopup && <SuccessPopup onClose={handleSuccessClose} />}
      </div>

      {/* แอนิเมชันกำหนดเอง */}
      <style>{`
        @keyframes pulse-width {
          0%, 100% { width: 75%; }
          50% { width: 100%; }
        }
        .animate-pulse-width {
          animation: pulse-width 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EmailVerification;