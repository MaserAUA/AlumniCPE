import { useMutation } from "@tanstack/react-query";
import api from "../configs/api";
import { GenerationStat } from "../models/stat";
import { axiosRequest } from "../utils/requestWrapper";

export const getAllReport = async () => {
  return axiosRequest(() => api.get("/utils/report"));
};

export const approveRequest = async (request_id: string) => {
  return axiosRequest(() => api.post(`/auth/request/${request_id}/approve`));
};

export const rejectRequest = async (request_id: string) => {
  return axiosRequest(() => api.post(`/auth/request/${request_id}/reject`));
};
