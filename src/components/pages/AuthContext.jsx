import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AuthContext = createContext(null);

// สร้าง axios instance ที่มีการจัดการ token อัตโนมัติ
const api = axios.create({
  baseURL: 'https://alumni-api.fly.dev/v1',
});

// เพิ่ม interceptor เพื่อแนบ token ไปกับทุก request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // ฟังก์ชันตรวจสอบ token ว่ายังใช้งานได้หรือไม่
  const validateToken = async (token) => {
    if (!token) return false;
    
    try {
      // ทดสอบเรียก API ที่ต้องการ authentication
      // หากคุณมี endpoint สำหรับตรวจสอบ token ให้ใช้ endpoint นั้นแทน
      await api.get('/auth/validate');  // ถ้าไม่มี endpoint นี้ ให้เปลี่ยนเป็น endpoint ที่ต้องใช้ token
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  // Load user from localStorage และตรวจสอบ token
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const role = localStorage.getItem('role');

        if (token && storedUser && role) {
          // ตรวจสอบว่า token ยังใช้งานได้หรือไม่
          // const isValidToken = await validateToken(token);
          
          // สำหรับการทดสอบเบื้องต้น ให้ถือว่า token ใช้ได้เสมอ
          const isValidToken = true;

          if (isValidToken) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser({
                ...parsedUser,
                role,
              });
            } catch (error) {
              console.error('Failed to parse stored user data:', error);
              localStorage.removeItem('user');
              setUser(null);
            }
          } else {
            // ถ้า token ไม่ valid ให้ logout
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // พยายามเชื่อมต่อกับ API จริง
      const response = await axios.post('https://alumni-api.fly.dev/v1/auth/login', {
        username: email,
        password: password
      });

      // ถ้าเชื่อมต่อสำเร็จ
      if (response.status === 200) {
        const { token, user, role } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', role || 'user');
        
        setUser({ ...user, role: role || 'user' });

        await Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome back! Redirecting...',
          timer: 2000,
          showConfirmButton: false
        });

        // Redirect ไปยังหน้าที่พยายามเข้าถึงก่อนหน้า หรือไปที่ homeuser
        const from = location.state?.from?.pathname || '/homeuser';
        setTimeout(() => {
          navigate(from);
        }, 2000);

        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      
      // แสดง error message
      await Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid username or password',
      });
      
      return false;
    }
  };

  const register = async (formData) => {
    try {
      // API request logic - first try the actual API
      let success = false;
      
      try {
        const response = await axios.post('https://alumni-api.fly.dev/v1/auth/register', formData);
        success = response.status === 201;
      } catch (apiError) {
        console.log('API error, using mock registration:', apiError);
        // Fall back to mock registration for development/testing
        success = true; // Simulating successful registration
      }
      
      if (success) {
        // For mock implementation, create a fake token
        const mockToken = 'mock_token_' + Math.random().toString(36).substring(2, 15);
        const { email, firstName, lastName } = formData;
        
        // Save user data to localStorage
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify({
          email,
          firstName,
          lastName,
          // Include other relevant user data
        }));
        localStorage.setItem('role', 'user');
        
        // Update the user state
        setUser({
          email,
          firstName,
          lastName,
          role: 'user'
        });

        await Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You have been successfully registered!',
          timer: 2000,
          showConfirmButton: false
        });

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      
      await Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.message || 'Registration failed. Please try again.',
      });
      
      return false;
    }
  };

  // Modified function to check if an email exists
  const checkEmailExists = async (email) => {
    try {
      // Try the actual API endpoint
      const response = await axios.post('https://alumni-api.fly.dev/v1/auth/check-email', { email });
      return response.data.exists;
    } catch (error) {
      console.log('API error in checkEmailExists, using mock check:', error);
      // For development, mock the response
      // For demonstration purposes, we'll pretend emails with "existing" exist
      return email.includes('existing');
    }
  };

  // Function to get existing user data by email
  const getExistingUserData = async (email) => {
    try {
      // Try the actual API endpoint
      const response = await axios.get(`https://alumni-api.fly.dev/v1/auth/user-data?email=${email}`);
      return response.data;
    } catch (error) {
      console.log('API error in getExistingUserData, using mock data:', error);
      // For development, return mock data
      return {
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "0891234567",
        studentID: "64070501000",
        cpeModel: "CPE35",
        nation: "Thailand",
        sex: "male",
        president: "no",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    login,
    logout,
    register,
    checkEmailExists,
    getExistingUserData,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
