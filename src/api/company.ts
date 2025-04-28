import { useMutation } from "@tanstack/react-query";
import api from "../configs/api";

export const useAddUserCompany = () => {
  return useMutation({
    mutationFn: async (data: AddUserCompany) => {
      const response = await api.post(`/users/${data.user_id}/companies`);
      return response.data;
    },
  });
};

export const useUpdateUserCompany = () => {
  return useMutation({
    mutationFn: async (data: UpdateUserCompany) => {
      const response = await api.put(
        `/users/${data.user_id}/companies/${data.company_id}`,
        data,
      );
      return response.data;
    },
  });
};

export const useDeleteUserCompany = () => {
  return useMutation({
    mutationFn: async (data: DeleteUserCompany) => {
      const response = await api.delete(
        `/user/${data.user_id}/companies/${data.company_id}`,
      );
      return response.data;
    },
  });
};
