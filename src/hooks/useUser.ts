import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  getAllUser,
  getUserById,
  createProfile,
  updateUserById,
  deleteUserById,
} from "../api/user";
import { updateStudentInfo, removeStudentInfo } from "../api/student_info";
import {
  CreateUserFormData,
  StudentInfo,
  UpdateUserFormData,
} from "../models/user";

export const useGetAllUser = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUser(),
  });
};

export const useGetUserById = (
  user_id: string | null,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["user", user_id],
    queryFn: () => getUserById(user_id || ""),
    enabled: options?.enabled ?? true,
  });
};

// CREATE user profile
export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserFormData) => createProfile(payload),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// UPDATE user by ID
export const useUpdateUserById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserFormData) => updateUserById(payload),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["user", data.user_id] });

      const previousUser = queryClient.getQueryData(["user", data.user_id]);

      queryClient.setQueryData(["user", data.user_id], (old: any) => ({
        ...old,
        ...data,
      }));

      return { previousUser };
    },
    onError: (_err, data, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(["user", data.user_id], context.previousUser);
      }
    },
    onSettled: (_data, _error, data) => {
      queryClient.invalidateQueries({ queryKey: ["user", data.user_id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// DELETE user by ID
export const useDeleteUserById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user_id: string) => deleteUserById(user_id),
    onMutate: async (user_id) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      await queryClient.cancelQueries({ queryKey: ["user", user_id] });

      const previousUsers = queryClient.getQueryData(["users"]);
      const previousUser = queryClient.getQueryData(["user", user_id]);

      queryClient.setQueryData(["users"], (old: any[] = []) =>
        old.filter((user) => user.id !== user_id),
      );

      queryClient.removeQueries({ queryKey: ["user", user_id] });

      return { previousUsers, previousUser };
    },
    onError: (_err, user_id, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
      if (context?.previousUser) {
        queryClient.setQueryData(["user", user_id], context.previousUser);
      }
    },
    onSettled: (_data, _error, user_id) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", user_id] });
      queryClient.invalidateQueries({ queryKey: ["jwt"] });
    },
  });
};

// UPDATE user by ID
export const useUpdateStudentInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: UpdateUserFormData) => updateStudentInfo(formData),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["user", data.user_id] });
      const previousUser = queryClient.getQueryData(["user", data.user_id]);

      queryClient.setQueryData(["user", data.user_id], (old: any) => ({
        ...old,
        student_info: {
          ...old.student_info,
          faculty: data.faculty,
          department: data.department,
          field: data.field,
          student_type: data.student_type,
        },
      }));

      return { previousUser };
    },
    onError: (_err, data, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(["user", data.user_id], context.previousUser);
      }
    },
    onSettled: (_data, _error, data) => {
      queryClient.invalidateQueries({ queryKey: ["user", data.user_id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
