// src/components/auth/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authApi, API_CONFIG } from './api/authApi';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiUrl, setApiUrl] = useState(API_CONFIG.BASE_URL);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to change API URL
  const changeApiUrl = (newUrl) => {
    setApiUrl(newUrl);
    // Update the API baseURL through its config
  };

  // Initialize auth state from localStorage
  // แก้ไขการใช้ localStorage เป็น sessionStorage
useEffect(() => {
  const initAuth = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const storedUser = sessionStorage.getItem('user');
      const role = sessionStorage.getItem('role');

      if (token && storedUser && role) {
        try {
          // Validate token with the backend
          const isValidToken = await authApi.validateToken().then(() => true).catch(() => false);

          if (isValidToken) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser({
                ...parsedUser,
                role,
              });
            } catch (error) {
              console.error('Failed to parse stored user data:', error);
              sessionStorage.removeItem('user');
              setUser(null);
            }
          } else {
            // Clear auth data if token is invalid
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('role');
            setUser(null);
          }
        } catch (error) {
          console.error('Error validating token:', error);
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('role');
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

// แก้ไขฟังก์ชัน login
const login = async (email, password) => {
  try {
    const authData = await authApi.login(email, password);
    
    const { token, user, role } = authData;
    
    // เก็บข้อมูลการยืนยันตัวตน
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('role', role || 'user');
    
    setUser({ ...user, role: role || 'user' });

    // แสดงข้อความสำเร็จ
    await Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: 'Welcome back! Redirecting...',
      timer: 2000,
      showConfirmButton: false
    });

    // Redirect ไปยังหน้าก่อนหน้าหรือหน้าหลัก
    const from = location.state?.from?.pathname || 
               (role === 'admin' ? '/admin' : '/homeuser');
    setTimeout(() => {
      navigate(from);
    }, 2000);

    return true;
  } catch (error) {
    // ตรงนี้ไม่ต้องแก้ไข เพราะเป็นการจัดการข้อผิดพลาด
    console.error('Login error:', error);
    
    await Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: error.response?.data?.message || 'Invalid username or password',
    });
    
    return false;
  }
};

// แก้ไขฟังก์ชัน register
const register = async (formData) => {
  try {
    const registrationData = await authApi.register(formData);
    
    const { token, user, role } = registrationData;
    
    // เก็บข้อมูลการยืนยันตัวตน
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('role', role || 'user');
    
    // อัปเดตสถานะผู้ใช้
    setUser({
      ...user,
      role: role || 'user'
    });

    // แสดงข้อความสำเร็จ
    await Swal.fire({
      icon: 'success',
      title: 'Registration Successful',
      text: 'You have been successfully registered!',
      timer: 2000,
      showConfirmButton: false
    });

    return true;
  } catch (error) {
    // ตรงนี้ไม่ต้องแก้ไข เพราะเป็นการจัดการข้อผิดพลาด
    console.error('Registration error:', error);
    
    await Swal.fire({
      icon: 'error',
      title: 'Registration Failed',
      text: error.response?.data?.message || 'Registration failed. Please try again.',
    });
    
    return false;
  }
};

// แก้ไขฟังก์ชัน logout
const logout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('role');
  setUser(null);
  navigate('/login');
};

  // Auth context value
  const value = {
    apiUrl,
    changeApiUrl,
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading
  };

  // Loading indicator
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

// Export API configuration for external use
export const API = {
  config: API_CONFIG,
  instance: authApi
};

export default AuthProvider;