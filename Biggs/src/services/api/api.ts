import axios, { AxiosError, isAxiosError } from "axios";

export const api = axios.create({
  // baseURL: "http://192.168.4.222:8080", // Office
  baseURL: "http://192.168.0.58:8082", // Home
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const handleApiError = (error: unknown): string => {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;

    return (
      axiosError.response?.data?.message || axiosError.message || "API Error"
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
