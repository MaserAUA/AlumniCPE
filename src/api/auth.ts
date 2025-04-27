import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserCredentials } from "../models/user";
import { AlumniRegistration, OTR } from "../models/registryCPE";
import api from "../configs/api";

// Registry User
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (registryForm: UserCredentials) => {
      const response = await api.post("/auth/registry/user", registryForm);
      return response.data;
    },
  });
};

export const useRequestOTR = () => {
  return useMutation({
    mutationFn: async (request: OTR) => {
      const response = await api.post("/auth/request_OTR", request);
      return response.data;
    },
  });
};

// Registry User
export const useRegisterAlumni = () => {
  return useMutation({
    mutationFn: async (registryForm: AlumniRegistration) => {
      const response = await api.post("/auth/registry/alumnus", registryForm);
      return response.data;
    },
  });
};

// Login User
export const useLoginUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loginForm: UserCredentials) => {
      const response = await api.post("/auth/login", loginForm);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the JWT query so it refetches the user info
      queryClient.invalidateQueries({ queryKey: ["jwt"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the JWT query so it refetches the user info
      queryClient.invalidateQueries({ queryKey: ["jwt"] });
    },
  });
};

// Login User
export const useVerifyToken = () => {
  return useQuery({
    queryKey: ["jwt"],
    queryFn: async () => {
      const response = await api.get("/auth/verify-token");
      return response.data.data;
    },
  });
};

// Request Reset Password
export const useRequestResetPassword = () => {
  return useQuery({
    queryKey: ["requestResetPassword"],
    queryFn: async () => {
      const response = await api.get("/auth/request_reset_password");
      return response.data;
    },
  });
};

// Request Change Email
export const useRequestChangeEmail = () => {
  return useQuery({
    queryKey: ["requestChangeEmail"],
    queryFn: async () => {
      const response = await api.get("/auth/request_change_email");
      return response.data;
    },
  });
};
