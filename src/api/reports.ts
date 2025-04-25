import { ReportPostForm } from "../models/post";

import api from "../configs/api";
import { useMutation } from "@tanstack/react-query";
export const useReportPostForm = () => {
  return useMutation({
    mutationFn: async (reportData: ReportPostForm) => {
      const response = await api.post("/v1/utils/report", reportData);
      return response.data;
    },
  });
};
