import { useMutation } from "@tanstack/react-query";
import api from "../configs/api";
import { GenerationStat } from "../models/stat";
import { axiosRequest } from "../utils/requestWrapper";

export const getPostUserStat = async () => {
  return axiosRequest(() => api.get("/stat/post"));
};

export const getGenerationStat = async (data: GenerationStat) => {
  return axiosRequest(() => api.get("/stat/generation"));
};

export const userSalaryStat = async () => {
  return axiosRequest(() => api.get("/stat/salary"));
};

export const userJob = async () => {
  return axiosRequest(() => api.get("/stat/job"));
};

export const alumniRegistryStat = async () => {
  return axiosRequest(() => api.get("/stat/registry"));
};

export const activityStat = async () => {
  return axiosRequest(() => api.get("/stat/activity"));
};
