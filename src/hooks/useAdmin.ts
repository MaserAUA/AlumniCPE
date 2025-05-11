import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getAllReport, approveRequest, rejectRequest } from "../api/utils";
import {
  CreateUserFormData,
  StudentInfo,
  UpdateUserFormData,
} from "../models/user";

export const useGetAllReport = () => {
  return useQuery({
    queryKey: ["report"],
    queryFn: () => getAllReport(),
  });
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request_id: string) => approveRequest(request_id),
    onMutate: async (request_id) => {
      await queryClient.cancelQueries({ queryKey: ["request"] });
      const previousReport = queryClient.getQueryData(["request"]);

      queryClient.setQueryData(["request"], (old: any) =>
        old.map((request) =>
          request.request.request_id === request_id
            ? {
                ...request,
                request: {
                  ...request.request,
                  status: "approve",
                },
              }
            : request,
        ),
      );

      return { previousReport };
    },
    onError: (_err, data, context) => {
      if (context?.previousReport) {
        queryClient.setQueryData(["request"], context.previousReport);
      }
    },
    onSettled: (_data, _error, data) => {
      queryClient.invalidateQueries({ queryKey: ["request"] });
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request_id: string) => rejectRequest(request_id),
    onMutate: async (request_id) => {
      await queryClient.cancelQueries({ queryKey: ["request"] });
      const previousReport = queryClient.getQueryData(["request"]);

      queryClient.setQueryData(["request"], (old: any) =>
        old.map((request) =>
          request.request.request_id === request_id
            ? {
                ...request,
                request: {
                  ...request.request,
                  status: "reject",
                },
              }
            : request,
        ),
      );

      return { previousReport };
    },
    onError: (_err, data, context) => {
      if (context?.previousReport) {
        queryClient.setQueryData(["request"], context.previousReport);
      }
    },
    onSettled: (_data, _error, data) => {
      queryClient.invalidateQueries({ queryKey: ["request"] });
    },
  });
};
