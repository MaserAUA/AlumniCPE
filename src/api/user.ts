import api from "../configs/api";
import { CreateUserFormData, UpdateUserFormData } from "../models/user";
import { cleanObject } from "../utils/format";
import { axiosRequest } from "../utils/requestWrapper";

export const getAllUser = async () => {
  return axiosRequest(() => api.get("/users"));
};
export const getUserById = async (user_id: string) => {
  return axiosRequest(() => api.get(`/users/${user_id}`));
};

export const createProfile = async (payload: CreateUserFormData) => {
  return axiosRequest(() => api.post("/users", payload));
};

export const updateUserById = async (formData: UpdateUserFormData) => {
  const user_id = formData.user_id;

  const payload = {
    first_name: formData.first_name,
    last_name: formData.last_name,
    first_name_eng: formData.first_name_eng,
    last_name_eng: formData.last_name_eng,
    gender: formData.gender,
    profile_picture: formData.profile_picture,
    student_info: {
      student_id: formData.student_id,
      generation: formData.generation,
      admit_year: formData.admit_year
        ? parseInt(formData.admit_year)
        : undefined,
      graduate_year: formData.graduate_year
        ? parseInt(formData.graduate_year)
        : undefined,
      gpax: formData.gpax ? parseFloat(formData.gpax) : undefined,
    },
    contact_info: {
      phone: formData.phone,
      github: formData.github,
      linkedin: formData.linkedin,
      facebook: formData.facebook,
    },
  };

  const cleanedPayload = cleanObject(payload);
  return axiosRequest(() => api.put(`/users/${user_id}`, cleanedPayload));
};

export const deleteUserById = async (user_id: string) => {
  return axiosRequest(() => api.delete(`/users/${user_id}`));
};
