import { useMutation } from "@tanstack/react-query";
import api from "../configs/api";
import { GenerationStat } from "../models/stat";
import { axiosRequest } from "../utils/requestWrapper";

export const postUserStat = async () => {
  return axiosRequest(() => api.get("/stat/post"));
};

export const generationStat = async (payload: GenerationStat) => {
  return axiosRequest(() => api.post("/stat/generation", payload));
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
