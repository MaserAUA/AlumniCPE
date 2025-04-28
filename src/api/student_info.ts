import { useMutation } from "@tanstack/react-query";
import api from "../configs/api";

export const useAddStudentInfo = () => {
  return useMutation({
    mutationFn: async (data: AddStudentInfo) => {
      const response = await api.post(`/users/${data.user_id}/student-info`);
      return response.data;
    },
  });
};

export const useUpdateStudentInfo = () => {
  return useMutation({
    mutationFn: async (data: UpdateStudentInfo) => {
      const response = await api.put(`/users/${data.user_id}/student-info`);
      return response.data;
    },
  });
};

export const useRemoveStudentInfo = () => {
  return useMutation({
    mutationFn: async (data: RemoveStudentInfo) => {
      const response = await api.delete(`/users/${data.user_id}/student_info`);
      return response.data;
    },
  });
};
