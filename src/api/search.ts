import { useMutation } from "@tanstack/react-query";
import api from "../configs/api";

export const useGetUserByFilter = () => {
  return useMutation({
    mutationFn: async (data: UserByFilter) => {
      const response = await api.get(`/users?search=${data}`);
      return response.data;
    },
  });
};

export const useGetUserByFulltextSearch = () => {
  return useMutation({
    mutationFn: async (data: UserByFulltextSearch) => {
      const response = await api.get("/users/fulltext_search");
      return response.data;
    },
  });
};

export const useGetUserThatAssociateWith = () => {
  return useMutation({
    mutationFn: async (data: UserThatAssociateWith) => {
      const response = await api.get(`/users/company_associate`);
      return response.data;
    },
  });
};

export const useGetFriendOfAFriendOfUser = () => {
  return useMutation({
    mutationFn: async (data: FriendOfaFriendOfUser) => {
      // const response = await api.get(`/user/${data.user_id}/foaf/${data.other_id?degree=3}`);
      // return response.data;
    },
  });
};
