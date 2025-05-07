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
import { axiosRequest } from "../utils/requestWrapper";

// Registry User
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (registryForm: UserRegistration) => {
      return axiosRequest(() => api.post("/auth/registry/user", registryForm));
    },
  });
};

export const useRequestOTR = () => {
  return useMutation({
    mutationFn: async (request: OTR) => {
      return axiosRequest(() => api.post("/auth/request_OTR", request));
    },
  });
};

// Registry User
export const useRegisterAlumni = () => {
  return useMutation({
    mutationFn: async (registryForm: AlumniRegistration) => {
      return axiosRequest(() =>
        api.post("/auth/registry/alumnus", registryForm),
      );
    },
  });
};

// Login User
export const useLoginUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loginForm: UserCredentials) => {
      return axiosRequest(() => api.post("/auth/login", loginForm));
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
      return axiosRequest(() => api.post("/auth/logout"));
    },
    onSuccess: () => {
      // Invalidate the JWT query so it refetches the user info
      queryClient.invalidateQueries({ queryKey: ["jwt"] });
    },
  });
};

// Verify JWT
export const useVerifyAccount = (
  token: string | null,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["jwt", token],
    queryFn: async () => {
      return axiosRequest(() =>
        api.get(`/auth/verify-account?token=${token || ""}`),
      );
    },
    enabled: options?.enabled ?? true,
  });
};

// Verify JWT
export const useVerifyToken = () => {
  return useQuery({
    queryKey: ["jwt"],
    queryFn: async () => {
      return axiosRequest(() => api.get("/auth/verify-token"));
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// Request Reset Password
export const useRequestResetPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      return axiosRequest(() =>
        api.post("/auth/request/password_reset", { email: email }),
      );
    },
  });
};

export const useResetPasswordConfirm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PasswordResetFormData) => {
      return axiosRequest(() =>
        api.post("/auth/request/password_reset/confirm", {
          password: payload.password,
          token: payload.token,
        }),
      );
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
      return axiosRequest(() =>
        api.post("/auth/request/email_change", { email: email }),
      );
    },
  });
};

export const useEmailConfirm = (email: string) => {
  const queryClient = useQueryClient();
  const { userId } = useAuthContext();
  return useMutation({
    mutationFn: async (token: string) => {
      return axiosRequest(() =>
        api.post(`/auth/request/email_change/confirm?token=${token}`),
      );
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

export const useRequestRole = () => {
  return useMutation({
    mutationFn: async () => {
      return axiosRequest(() => api.post("/auth/request/role"));
    },
  });
};
