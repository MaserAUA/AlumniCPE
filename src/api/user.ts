import api from "../configs/api";
import { CreateUserFormData, UpdateUserFormData } from "../models/user";

// --- Centralized mutation functions ---
export const getUserById = async (user_id: string) => {
  const { data } = await api.get(`/users/${user_id}`);
  return data.data;
};

export const createProfile = async (payload: CreateUserFormData) => {
  const { data } = await api.post("/users", payload);
  return data;
};

export const updateUserById = async (payload: UpdateUserFormData) => {
  const { user_id, ...rest } = payload;
  const { data } = await api.put(`/users/${user_id}`, rest);
  return data;
};

export const deleteUserById = async (user_id: string) => {
  const { data } = await api.delete(`/users/${user_id}`);
  return data.data;
};
