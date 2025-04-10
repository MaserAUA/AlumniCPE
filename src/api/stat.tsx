import { useMutation } from "@tanstack/react-query"
import api from "../configs/api";
import { AlumniRegistryStat, GenerationStat, UserJob, UserSalary, UserStat } from "../models/stat";

export const useGetPostUserStat = () => {
    return useMutation({
        mutationFn: async (data: UserStat) => {
            const response = await api.get("/stat/post");
            return response.data;
        }
    });
}

export const useGetGenerationStat = () => {
    return useMutation({
        mutationFn: async (data: GenerationStat) => {
            const response = await api.get("/stat/generation");
            return response.data;
        }
    });
}

export const useUserSalaryStat = () => {
    return useMutation({
        mutationFn: async (data: UserSalary) => {
            const response = await api.get("/stat/salary");
            return response.data;
        }
    });
}

export const useUserJob = () => {
    return useMutation({
        mutationFn: async (data: UserJob) => {
            const response = await api.get("/stat/job");
            return response.data;
        }
    });
}

export const useAlumniRegistryStat = () => {
    return useMutation({
        mutationFn: async (data: AlumniRegistryStat) => {
            const response = await api.get("/stat/registry")
            return response.data;
        }
    })
}   