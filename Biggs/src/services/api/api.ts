import axios, { AxiosError, isAxiosError } from "axios";

type ApiErrorPayload = {
  message?: string;
  data?: {
    message?: string;
  };
};

export const baseApiUrl = "http://192.168.4.222:8080"; // Office
// export const baseApiUrl = "http://192.168.0.58:8082"; // Home

export const api = axios.create({
  baseURL: baseApiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const handleApiError = (error: unknown): string => {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorPayload>;
    const payload = axiosError.response?.data;

    return (
      payload?.message ||
      payload?.data?.message ||
      axiosError.message ||
      "API Error"
    );
  }

  return "Unexpected error occurred";
};

// api.interceptors.request.use(
//   (config) => {
//     const token = getAuthToken(); // Implement this function to retrieve the token from storage
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     console.error("Request Interceptor Error:", error);
//     return Promise.reject(error);
//   },
// );
