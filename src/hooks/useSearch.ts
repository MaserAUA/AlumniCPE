import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { getCompanyName } from "../api/search";

export const useGetCompanyName = (query: string) => {
  return useQuery({
    queryKey: ["company_search", query],
    queryFn: () => getCompanyName(query),
    staleTime: 5 * 60 * 1000,
  });
};
