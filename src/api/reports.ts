import { ReportPostForm } from "../models/post";
import { axiosRequest } from "../utils/requestWrapper";

import api from "../configs/api";
import { useMutation } from "@tanstack/react-query";
export const useReportPostForm = () => {
  return useMutation({
    mutationFn: async (reportData: ReportPostForm) => {
      return axiosRequest(() => api.post("/utils/report", reportData));
    },
  });
};
