import { useMutation } from "@tanstack/react-query";
import api from "../configs/api";
import { GenerationStat } from "../models/stat";
import { axiosRequest } from "../utils/requestWrapper";

export const getAllReport = async () => {
  return axiosRequest(() => api.get("/utils/report"));
};
