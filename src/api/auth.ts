import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserCredentials } from "../models/user";
import {
  AlumniRegistration,
  OTR,
  UserRegistration,
  PasswordResetFormData,
} from "../models/registryCPE";
import api from "../configs/api";
import { useAuthContext } from "../context/auth_context";

// Registry User
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (registryForm: UserRegistration) => {
      const response = await api.post("/auth/registry/user", registryForm);
      return response.data.data;
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

// Verify JWT
export const useVerifyAccount = (token: string) => {
  return useQuery({
    queryKey: ["jwt", token],
    queryFn: async () => {
      const response = await api.get(`/auth/verify-account?token=${token}`);
      return response.data.data;
    },
  });
};

// Verify JWT
export const useVerifyToken = () => {
  return useQuery({
    queryKey: ["jwt"],
    queryFn: async () => {
      try {
        const response = await api.get("/auth/verify-token");
        return response.data.data;
      } catch (err) {
        if (err.response?.status === 401) {
          return null;
        }
        throw err;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// Request Reset Password
export const useRequestResetPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post("/auth/request/password_reset", {
        email: email,
      });
      return response.data.data;
    },
  });
};

export const useResetPasswordConfirm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PasswordResetFormData) => {
      const response = await api.post("/auth/request/password_reset/confirm", {
        password: payload.password,
        token: payload.token,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jwt"] });
    },
  });
};

// Request Change Email
export const useRequestChangeEmail = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuthContext();
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.post("/auth/request/email_change", {
        email: email,
      });
      return data.data;
    },
  });
};

export const useEmailConfirm = (email: string) => {
  const queryClient = useQueryClient();
  const { userId } = useAuthContext();
  return useMutation({
    mutationFn: async (token: string) => {
      const { data } = await api.post(
        `/auth/request/email_change/confirm?token=${token}`,
      );
      return data.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["user", userId] });
      const previousUser = queryClient.getQueryData(["user", userId]);

      queryClient.setQueryData(["user", userId], (old: any) => ({
        ...old,
        contact_info: {
          email: email,
        },
      }));

      return { previousUser };
    },
    onError: (_err, data, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(["user", userId], context.previousUser);
      }
    },
    onSettled: (_data, _error, data) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      // queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
