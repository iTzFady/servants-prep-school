import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { secureStore } from "./secureStore";
import { ERRORS } from "@/data/errors";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_BASEURL || process.env.EXPO_BASEURL;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await secureStore.getToken();
      if (token) {
        if (!config.headers) config.headers = {} as any;
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error adding token to request:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error as any;
    let userMessage = ERRORS.DEFAULT;

    if (response) {
      const data = response.data || {};
      const code = (data.code || data.error || data.message || "").toString();
      if (code && ERRORS[code]) {
        userMessage = ERRORS[code];
      } else {
        switch (response.status) {
          case 401:
            userMessage = ERRORS.INVALID_TOKEN;
            try {
              await secureStore.removeToken();
            } catch (e) {
              console.error("Error removing token on 401:", e);
            }
            break;
          case 403:
            userMessage = ERRORS.ACCESS_DENIED;
            break;
          case 500:
          default:
            userMessage = ERRORS.DEFAULT;
        }
      }
    } else if (error.request) {
      userMessage =
        "خطأ في الاتصال بالخادم. تأكد من اتصال الإنترنت وحاول مرة أخرى.";
    }

    (error as any).userMessage = userMessage;
    (error as any).message = userMessage;

    return Promise.reject(error);
  },
);

export default apiClient;
