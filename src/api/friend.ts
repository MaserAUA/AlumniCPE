import { useMutation } from "@tanstack/react-query";
import api from "../configs/api";

export const useGetUserFriendById = () => {
  return useMutation({
    mutationFn: async (data: UserFriendById) => {
      const response = await api.get(`/users/${data.user_id}/friends`);
      return response.data;
    },
  });
};

export const useAddFriend = () => {
  return useMutation({
    mutationFn: async (data: AddFriend) => {
      const response = await api.post(`/users/${data.user_id}/friends`);
      return response.data;
    },
  });
};

export const useUnfriend = () => {
  return useMutation({
    mutationFn: async (data: Unfriend) => {
      const response = await api.delete(`/users/${data.user_id}/friend`);
      return response.data;
    },
  });
};
