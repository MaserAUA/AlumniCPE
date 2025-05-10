import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getAllReport } from "../api/utils";
import { updateStudentInfo, removeStudentInfo } from "../api/student_info";
import {
  CreateUserFormData,
  StudentInfo,
  UpdateUserFormData,
} from "../models/user";

export const useGetAllReport = () => {
  return useQuery({
    queryKey: ["report"],
    queryFn: () => getAllReport(),
  });
};
