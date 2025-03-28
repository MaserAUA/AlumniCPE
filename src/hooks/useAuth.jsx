import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AuthContext = createContext(null);

const api = axios.create({
  baseURL: 'https://alumni-api.fly.dev/v1',
});

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

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('user_d');
        const role = localStorage.getItem('role');

        if (token && user_id && role) {
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
      const response = await axios.post('https://alumni-api.fly.dev/v1/auth/login', {
        username: email,
        password: password
      });

      if (response.status === 200) {
        const { token, user, role } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', JSON.stringify(user));
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
        success = true; // Simulating successful registration
      }
      
      if (success) {
        const { email, firstName, lastName } = formData;
        
        // Save user data to localStorage
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user_id', JSON.stringify({
          email,
          firstName,
          lastName,
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
