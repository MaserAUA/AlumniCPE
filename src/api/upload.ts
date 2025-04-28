import { Upload } from "../models/post";
import api from "../configs/api";
import { useMutation } from "@tanstack/react-query";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      // Check file size (5MB limit)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(
          `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        );
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (!response.data.url) {
          throw new Error("Invalid response from server");
        }

        return {
          url: response.data.url,
          name: file.name,
          size: file.size,
        };
      } catch (error) {
        if (error.response?.status === 401) {
          throw new Error("Please login to upload files");
        } else if (error.response?.status === 413) {
          throw new Error("File size is too large");
        } else {
          throw new Error("Failed to upload file. Please try again.");
        }
      }
    },
  });
};
