import { Upload } from "../models/post";
import api from "../configs/api";

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!data.data.url) {
    throw new Error("Invalid response from server");
  }

  return {
    url: `https://alumni.cpe.kmutt.ac.th/api/v1${data.data.url}`,
    name: file.name,
    size: file.size,
  };
};
