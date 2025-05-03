import api from "../configs/api";
import { CreateUserFormData, UpdateUserFormData } from "../models/user";
import { cleanObject } from "../utils/format";

export const getAllUser = async () => {
  const { data } = await api.get("/users");
  return data.data;
};
export const getUserById = async (user_id: string) => {
  const { data } = await api.get(`/users/${user_id}`);
  return data.data;
};

export const createProfile = async (payload: CreateUserFormData) => {
  const { data } = await api.post("/users", payload);
  return data;
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
  const { data } = await api.put(`/users/${user_id}`, cleanedPayload);

  return data;
};

export const deleteUserById = async (user_id: string) => {
  const { data } = await api.delete(`/users/${user_id}`);
  return data.data;
};
