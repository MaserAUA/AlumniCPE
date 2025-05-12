import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import {
  activityStat,
  postUserStat,
  alumniRegistryStat,
  userJob,
} from "../api/stat";

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
