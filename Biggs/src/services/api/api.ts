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

// ✅ Interceptor on the api instance, not global axios
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    if (error.response?.status === 401) {
      // redirect to login / clear auth state
      console.warn("[API] Unauthorized — redirecting to login");
    }

    return Promise.reject(error);
  },
);

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

export const isNotFoundError = (error: unknown): boolean =>
  isAxiosError(error) && error.response?.status === 404;
