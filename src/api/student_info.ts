import { useMutation } from "@tanstack/react-query";
import { axiosRequest } from "../utils/requestWrapper";
import api from "../configs/api";
import { StudentInfo, UpdateUserFormData } from "../models/user";

export const addStudentInfo = async (formData: UpdateUserFormData) => {
  const user_id = formData.user_id;
  const payload = {
    faculty: formData.faculty,
    department: formData.department,
    field: formData.field,
    studentType: formData.studentType,
  };
  return axiosRequest(() =>
    api.post(`/users/${user_id}/student_info`, payload),
  );
};

export const updateStudentInfo = async (formData: UpdateUserFormData) => {
  const user_id = formData.user_id;
  const payload = {
    faculty: formData.faculty,
    department: formData.department,
    field: formData.field,
    studentType: formData.studentType,
  };
  return axiosRequest(() => api.put(`/users/${user_id}/student_info`, payload));
};

export const removeStudentInfo = async (user_id: string) => {
  return axiosRequest(() => api.delete(`/users/${user_id}/student_info`));
};
