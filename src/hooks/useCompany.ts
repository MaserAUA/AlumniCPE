import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { UserCompany } from "../models/company";
import { v4 as uuid4 } from "uuid";
import {
  addUserCompany,
  updateUserCompany,
  deleteUserCompany,
} from "../api/company";

export const useAddUserCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserCompany) => addUserCompany(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["user", data.user_id] });
      const previousUser = queryClient.getQueryData(["user", data.user_id]);

      queryClient.setQueryData(["user", data.user_id], (old: any = {}) => ({
        ...old,
        companies: [
          ...(old.companies ?? []),
          {
            company_id: uuid4(),
            company: data.company,
            position: data.position,
            salary_min: data.salary_min,
            salary_max: data.salary_max,
          },
        ],
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
    },
  });
};

export const useUpdateUserCompany = () => {
  return useMutation({
    mutationFn: (data: UserCompany) => updateUserCompany(data),
  });
};

export const useDeleteUserCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserCompany) => deleteUserCompany(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["user", data.user_id] });
      const previousUser = queryClient.getQueryData(["user", data.user_id]);

      queryClient.setQueryData(["user", data.user_id], (old: any = {}) => ({
        ...old,
        companies: (old.companies || []).filter(
          (company: any) => company.company_id !== data.company_id,
        ),
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
    },
  });
};
