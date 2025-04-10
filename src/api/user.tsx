import { useMutation } from "@tanstack/react-query"
import api from "../configs/api";
import { UserById, UserByFilter, UserByFulltextSearch,  UserThatAssociateWith, FriendOfaFriendOfUser,  UserFriendById, CreateProfile, AddFriend, AddStudentInfo, AddUserCompany,UpdateUserById,UpdateStudentInfo, UpdateUserCompany, DeleteUserById, Unfriend, RemoveStudentInfo, DeleteUserCompany
} from "../models/user";

// GET endpoints
export const useGetUserById = () => {
    return useMutation({
        mutationFn: async (data: UserById) => {
            const response = await api.get("/users/"+data.user_id);
            return response.data;
        }
    })
}

export const useGetUserByFilter = () => {
    return useMutation({
        mutationFn: async (data: UserByFilter) => {
            const response = await api.get("/users", {params: data});
            return response.data;
        }
    })
}

export const useGetUserByFulltextSearch = () => {
    return useMutation({
        mutationFn: async (data: UserByFulltextSearch) => {
            const response = await api.get("/users/fulltext_search");
            return response.data;
        }
    })
}

export const useGetUserThatAssociateWith = () => {
    return useMutation({
        mutationFn: async (data: UserThatAssociateWith) => {
            const response = await api.get(`/users/company_associate`);
            return response.data;
        }
    })
}

export const useGetFriendOfAFriendOfUser = () => {
    return useMutation({
        mutationFn: async (data: FriendOfaFriendOfUser) => {
            // const response = await api.get(`/user/${data.user_id}/foaf/${data.other_id?degree=3}`);
            // return response.data;
        }
    })
}

export const useGetUserFriendById = () => {
    return useMutation({
        mutationFn: async (data: UserFriendById) => {
            const response = await api.get(`/users/${data.user_id}/friends`);
            return response.data;
        }
    })
}

// POST endpoints
export const useCreateProfile = () => {
    return useMutation({
        mutationFn: async (data: CreateProfile) => {
            const response = await api.post("/users", data);
            return response.data;
        }
    })
}

export const useAddFriend = () => {
    return useMutation({
        mutationFn: async (data: AddFriend) => {
            const response = await api.post(`/users/${data.user_id}/friends`);
            return response.data;
        }
    })
}

export const useAddStudentInfo = () => {
    return useMutation({
        mutationFn: async (data: AddStudentInfo) => {
            const response = await api.post(`/users/${data.user_id}/student-info`);
            return response.data;
        }
    })
}

export const useAddUserCompany = () => {
    return useMutation({
        mutationFn: async (data: AddUserCompany) => {
            const response = await api.post(`/users/${data.user_id}/companies`);
            return response.data;
        }
    })
}

// PUT endpoints
export const useUpdateUserById = () => {
    return useMutation({
        mutationFn: async (data: UpdateUserById) => {
            const response = await api.put(`/users/${data.user_id}`);
            return response.data;
        }
    })
}

export const useUpdateStudentInfo = () => {
    return useMutation({
        mutationFn: async (data: UpdateStudentInfo) => {
            const response = await api.put(`/users/${data.user_id}/student-info`);
            return response.data;
        }
    })
}

export const useUpdateUserCompany = () => {
    return useMutation({
        mutationFn: async (data: UpdateUserCompany ) => {
            const response = await api.put(`/users/${data.user_id}/companies/${data.company_id}`, data);
            return response.data;
        }
    })
}

// DELETE endpoints
export const useDeleteUserById = () => {
    return useMutation({
        mutationFn: async (data: DeleteUserById ) => {
            const response = await api.delete(`/users/${data.user_id}`);
            return response.data;
        }
    })
}

export const useUnfriend = () => {
    return useMutation({
        mutationFn: async (data: Unfriend ) => {
            const response = await api.delete(`/users/${data.user_id}/friend`);
            return response.data;
        }
    })
}

export const useRemoveStudentInfo = () => {
    return useMutation({
        mutationFn: async (data: RemoveStudentInfo ) => {
            const response = await api.delete(`/users/${data.user_id}/student_info`);
            return response.data;
        }
    })
}

export const useDeleteUserCompany = () => {
    return useMutation({
        mutationFn: async (data: DeleteUserCompany ) => {
            const response = await api.delete(`/user/${data.user_id}/companies/${data.company_id}`);
            return response.data;
        }
    })
}