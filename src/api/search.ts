import { useMutation } from "@tanstack/react-query";
import api from "../configs/api";
import { axiosRequest } from "../utils/requestWrapper";

export const getCompanyName = async (query: string) => {
  return axiosRequest(() =>
    api.get(`/utils/fulltext_search/company?query=${query}`),
  );
};

// export const getUserByFilter = async (data: UserByFilter) => {
//   return axiosRequest(() => api.get(`/users?search=${data}`));
// };

// export const getUserByFilter = async (data: UserByFilter) => {
//   return axiosRequest(() => api.get(`/users?search=${data}`));
// };

// export const getUserByFulltextSearch = async (
//   data: UserByFulltextSearch,
// ) => {
//   return axiosRequest(() => api.get("/users/fulltext_search"));
// };

// export const getUserThatAssociateWith = async (
//   data: UserThatAssociateWith,
// ) => {
//   return axiosRequest(() => api.get(`/users/company_associate`));
// };

// export const getFriendOfAFriendOfUser = async (
//   data: FriendOfaFriendOfUser,
// ) => {
//   return axiosRequest(() =>
//     api.get(`/user/${data.user_id}/foaf/${data.other_id}?degree=3}`),
//   );
// };
