import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { activityStat } from "../api/stat";

export const useGetAcitivityStat = () => {
  return useQuery({
    queryKey: ["activity_stat"],
    queryFn: () => activityStat(),
  });
};
