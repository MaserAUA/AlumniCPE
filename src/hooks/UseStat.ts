import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { activityStat, postUserStat } from "../api/stat";

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
