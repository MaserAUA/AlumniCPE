import api from "../configs/api";
import { UserCompany } from "../models/company";
import { axiosRequest } from "../utils/requestWrapper";

export const addUserCompany = async (data: UserCompany) => {
  const payload = {
    companies: [
      {
        company: data.company,
        position: data.position,
        salary_min: parseInt(data.salary_min || "0"),
        salary_max: parseInt(data.salary_max || "0"),
      },
    ],
  };

  return axiosRequest(() =>
    api.post(`/users/${data.user_id}/companies`, payload),
  );
};

export const updateUserCompany = async (data: UserCompany) => {
  return axiosRequest(() =>
    api.put(`/users/${data.user_id}/companies/${data.company_id}`, data),
  );
};

export const deleteUserCompany = async (data: UserCompany) => {
  return axiosRequest(() =>
    api.delete(`/users/${data.user_id}/companies/${data.company_id}`),
  );
};
