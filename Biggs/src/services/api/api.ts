import axios, { AxiosError, isAxiosError } from "axios";

type ApiErrorPayload = {
  message?: string;
  data?: {
    message?: string;
  };
};

const DEV_FALLBACK_API_URL = "http://192.168.4.222:8080";

function normalizeApiBaseUrl(value: string): string {
  const trimmed = value.trim();
  return trimmed.replace(/\/+$/, "");
}

const envApiUrl = process.env.EXPO_PUBLIC_API_URL;

console.log("[API] Raw API URL from env:", envApiUrl);
const resolvedApiBaseUrl =
  typeof envApiUrl === "string" && envApiUrl.trim() !== ""
    ? envApiUrl
    : DEV_FALLBACK_API_URL;

export const baseApiUrl = normalizeApiBaseUrl(resolvedApiBaseUrl);

export const api = axios.create({
  baseURL: baseApiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

console.log("[API] baseURL:", baseApiUrl);

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
