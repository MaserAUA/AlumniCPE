import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useLoginUser, useRegisterUser } from '../api/auth';
import { useAuthContext } from '../context/auth_context';

export const useAuth = () => {
  const { setJwt, setUserId, setRole } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  // Fetch login function from TanStack Query
  const loginMutation = useLoginUser();
  const registerMutation = useRegisterUser();

  const login = async (username: string, password: string) => {
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: (res) => {
          // Save auth data to state and localStorage
          const data = res.data
          setJwt(data.token);
          setUserId(data.user_id);
          setRole(data.user_role);
          localStorage.setItem('jwt', data.token);
          localStorage.setItem('user_id', data.user_id);
          localStorage.setItem('role', data.user_role);

          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'Welcome back! Redirecting...',
            timer: 2000,
            showConfirmButton: false
          });
          const from = location.state?.from?.pathname || '/homeuser';
          setTimeout(() => navigate(from), 2000);
          return res
        },
        onError: (err) => {
          console.log(err)
          setError("Login failed, please check your credentials.");
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid username or password',
          });
          return err
        }
      }
    );
  };

  const register = async (username: string, password: string) => {
    registerMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'You have been successfully registered!',
            timer: 2000,
            showConfirmButton: false
          });

          const from = location.state?.from?.pathname || '/homeuser';
          setTimeout(() => navigate(from), 2000);
        },
        onError: (error) => {
          setError("Registration failed, please check your credentials.");
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.message || 'Registration failed. Please try again.',
          });
        }
      }
    );
  };

  const logout = () => {
    setJwt(null);
    setUserId(null);
    setRole(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return {
    login,
    logout,
    register,
    loading: loginMutation.isPending || registerMutation.isPending,
    error
  };
};
