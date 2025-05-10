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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registryForm: AlumniRegistration) => {
      return axiosRequest(() =>
        api.post("/auth/registry/alumnus", registryForm),
      );
    },
    onMutate: async (form) => {
      await queryClient.cancelQueries({ queryKey: ["activity_stat"] });
      const previousActivityStat = queryClient.getQueryData(["activity_stat"]);
      queryClient.setQueryData(["activity_stat"], (prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          user_count: prev.user_count + 1,
        };
      });
      return { previousActivityStat };
    },
    onError: (_err, _newPost, context) => {
      if (context?.previousActivityStat) {
        queryClient.setQueryData(
          ["activity_stat"],
          context.previousActivityStat,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["activity_stat"] });
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

export const useVerifyAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) => {
      return axiosRequest(() =>
        api.post("/auth/verify-account", { token: token }),
      );
    },
    onMutate: async (token) => {
      await queryClient.cancelQueries({ queryKey: ["activity_stat"] });
      const previousActivityStat = queryClient.getQueryData(["activity_stat"]);
      queryClient.setQueryData(["activity_stat"], (prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          user_count: prev.user_count + 1,
        };
      });
      return { previousActivityStat };
    },
    onError: (_err, _newPost, context) => {
      if (context?.previousActivityStat) {
        queryClient.setQueryData(
          ["activity_stat"],
          context.previousActivityStat,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["activity_stat"] });
    },
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

export const useGetAllRequest = () => {
  return useQuery({
    queryKey: ["request"],
    queryFn: async () => {
      return axiosRequest(() => api.get("/auth/request"));
    },
  });
};

export const useRequestRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return axiosRequest(() => api.post("/auth/request/role"));
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["request"] });
      const previousUser = queryClient.getQueryData(["request"]);

      queryClient.setQueryData(["request"], (old: any) => [...old, data]);

      return { previousUser };
    },
    onError: (_err, data, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(["request"], context.previousUser);
      }
    },
    onSettled: (_data, _error, data) => {
      queryClient.invalidateQueries({ queryKey: ["request"] });
    },
  });
};
