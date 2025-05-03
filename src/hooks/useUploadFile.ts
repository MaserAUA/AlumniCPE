import imageCompression from "browser-image-compression";
import { Upload } from "../models/post";
import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "../api/upload";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: async (
      file: File,
    ): Promise<{ url: string; name: string; size: number }> => {
      const MAX_FILE_SIZE_MB = 1;

      const options = {
        maxSizeMB: MAX_FILE_SIZE_MB,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
      };

      try {
        const compressedFile = await imageCompression(file, options);

        // Optional: rename to .webp
        const webpFile = new File(
          [compressedFile],
          file.name.replace(/\.[^/.]+$/, ".webp"),
          {
            type: "image/webp",
          },
        );

        return uploadFile(webpFile);
      } catch (error: any) {
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
