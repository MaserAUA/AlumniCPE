import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useLoginUser,
  useRegisterUser,
  useRegisterAlumni,
  useRequestOTR,
  useLogout,
} from "../api/auth";

import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useAuthContext } from "../context/auth_context";
import { initWebSocket } from "./useNotifiaction";

export const useAuth = () => {
  const { setUserId, setRole } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  // Fetch login function from TanStack Query
  const loginMutation = useLoginUser();
  const logoutMutation = useLogout();
  const registerMutation = useRegisterUser();
  const registerAlumniMutation = useRegisterAlumni();
  const requestOTRMutation = useRequestOTR();

  const login = async (username: string, password: string) => {
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: (res) => {
          setUserId(res.user_id);
          setRole(res.user_role);
          initWebSocket(res.token);

          Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "Welcome back! Redirecting...",
            timer: 500,
            showConfirmButton: false,
          });
          const from = location.state?.from?.pathname || "/homeuser";
          setTimeout(() => navigate(from), 500);
          return res;
        },
        onError: (err) => {
          console.log(err.message);
          setError("Login failed, please check your credentials.");
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: err.message || "Invalid username or password",
          });
          return err;
        },
      },
    );
  };

  const registerUser = async (
    username: string,
    email: string,
    password: string,
  ) => {
    registerMutation.mutate(
      { username, email, password },
      {
        onSuccess: (res) => {
          Swal.fire({
            icon: "success",
            title: "Waiting for verification",
            text: `If your email exist in database one time registration been send to email with\nref: ${res.reference_number}`,
            showConfirmButton: false,
          });
        },
        onError: (error) => {
          setError("Registration failed, please check your credentials.");
          Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: error.message || "Registration failed. Please try again.",
          });
        },
      },
    );
  };
  const registerAlumni = async (
    token: string,
    username: string,
    password: string,
  ) => {
    registerAlumniMutation.mutate(
      { token, username, password },
      {
        onSuccess: (res) => {
          Swal.fire({
            icon: "success",
            title: "Registration Successful",
            text: "You have been successfully registered!",
            timer: 2000,
            showConfirmButton: false,
          });

          const from = location.state?.from?.pathname || `/registry`;
          setTimeout(() => navigate(from), 2000);
        },
        onError: (error) => {
          setError("Registration failed, please check your credentials.");
          Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: error.message || "Registration failed. Please try again.",
          });
        },
      },
    );
  };

  const requestOTR = async (email: string) => {
    requestOTRMutation.mutate(
      { email },
      {
        onSuccess: (res) => {
          Swal.fire({
            icon: "success",
            title: "One Time Registration",
            text: `If your email exist in database one time registration been send to email with ref: ${res.reference_number}`,
            showConfirmButton: false,
          });
        },
        onError: (error) => {
          setError("Registration failed, please check your credentials.");
          Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: error.message || "Registration failed. Please try again.",
          });
        },
      },
    );
  };

  const logout = () => {
    logoutMutation.mutate();
    setUserId(null);
    setRole(null);
  };

  return {
    login,
    logout,
    registerUser,
    registerAlumni,
    requestOTR,
    loading: loginMutation.isPending || registerMutation.isPending,
    error,
  };
};
