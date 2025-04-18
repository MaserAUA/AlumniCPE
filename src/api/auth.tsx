import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserCredentials } from "../models/user";
import api from "../configs/api";

// Registry User
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (registryForm: UserCredentials) => {
      const response = await api.post("/registry_user", registryForm);
      return response.data;
    },
  });
};

// Registry User
export const useRegisterAlumni = () => {
  return useMutation({
    mutationFn: async (registryForm: UserCredentials) => {
      const response = await api.post("/registry_alumni", registryForm);
      return response.data;
    },
  });
};

// Login User
export const useLoginUser = () => {
  return useMutation({
    mutationFn: async (loginForm: UserCredentials) => {
      const response = await api.post("/login", loginForm);
      return response.data;
    },
  });
};

// Request Reset Password
export const useRequestResetPassword = () => {
  return useQuery({
    queryKey: ["requestResetPassword"],
    queryFn: async () => {
      const response = await api.get("/request_reset_password");
      return response.data;
    },
  });
};

// Request Change Email
export const useRequestChangeEmail = () => {
  return useQuery({
    queryKey: ["requestChangeEmail"],
    queryFn: async () => {
      const response = await api.get("/request_change_email");
      return response.data;
    },
  });
};

export const useAlumniCheckExist = () => {
  return useMutation({
    mutationFn: async (registryForm: UserCredentials) => {
      const response = await api.post("/registry_alumni", registryForm);
      return response.data;
    },
  });
};
