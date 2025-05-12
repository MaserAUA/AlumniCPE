import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import {
  activityStat,
  postUserStat,
  alumniRegistryStat,
  userJob,
  userSalaryStat,
  generationStat,
} from "../api/stat";
import { GenerationStat } from "../models/stat";

export const useGetAcitivityStat = () => {
  return useQuery({
    queryKey: ["activity_stat"],
    queryFn: () => activityStat(),
  });
};

export const useGetPostUserStat = () => {
  return useQuery({
    queryKey: ["post_stat"],
    queryFn: () => postUserStat(),
  });
};

export const useGetRegistryStat = () => {
  return useQuery({
    queryKey: ["registry_stat"],
    queryFn: () => alumniRegistryStat(),
  });
};

export const useGetUserJob = () => {
  return useQuery({
    queryKey: ["job_stat"],
    queryFn: () => userJob(),
  });
};

export const useGetSalaryStat = () => {
  return useQuery({
    queryKey: ["salary_stat"],
    queryFn: () => userSalaryStat(),
  });
};

export const useGetGenerationStat = (payload: GenerationStat) => {
  return useQuery({
    queryKey: ["generation_stat", payload.cpe],
    queryFn: () => generationStat(payload),
  });
};
