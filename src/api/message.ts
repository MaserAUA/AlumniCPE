import { useMutation } from "@tanstack/react-query"
import api from "../configs/api";
import { ChatMessage, DeleteMessage, EditMessage, ReplyMessage, SendMessage } from "../models/Message";

export const useChatMessage = () => {
    return useMutation({
        mutationFn: async (data: ChatMessage) => {
            const response = await api.get(`/user/${data.user_id}/chat_message/${data.other_user_id}`);
            return response.data;
        }
    });
}

export const useSendMessage = () => {
    return useMutation({
        mutationFn: async (data: SendMessage) => {
            const response = await api.get(`/user/${data.user_id}/message/send`);
            return response.data;
        }
    });
}

export const useReplyMessage = () => {
    return useMutation({
        mutationFn: async (data: ReplyMessage) => {
            const response = await api.get(`/user/${data.user_id}/message/reply`);
            return response.data;
        }
    });
}

export const useEditMessage = () => {
    return useMutation({
        mutationFn: async (data: EditMessage) => {
            const response = await api.get(`/user/${data.user_id}/message/${data.message_id}`);
            return response.data;
        }
    });
}

export const useDeleteMessage = () => {
    return useMutation({
        mutationFn: async (data: DeleteMessage) => {
            const response = await api.get(`/user/${data.user_id}/message/${data.message_id}`);
            return response.data;
        }
    });
}