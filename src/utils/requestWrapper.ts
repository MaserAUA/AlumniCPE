import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Wrapper for Axios requests that extracts useful error messages.
 * Automatically returns `response.data.data`.
 */
export async function axiosRequest<T = any>(
  requestFn: () => Promise<AxiosResponse<{ data: T }>>,
): Promise<T> {
  try {
    const response = await requestFn();
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        error.message;

      throw new Error(message);
    }
    throw error;
  }
}
