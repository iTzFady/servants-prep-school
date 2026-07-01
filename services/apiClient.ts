import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { secureStore } from "./secureStore";
import { ERRORS } from "@/data/errors";
import { store } from "@/store/store";
import { clearAuth } from "@/store/authSlice";
import Toast from "react-native-toast-message";
import * as Sentry from "@sentry/react-native";

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
    Sentry.captureException(new Error(error));
    const { response } = error as any;
    let userMessage = ERRORS.DEFAULT;
    let isTokenInvalid = false;

    if (response) {
      const data = response.data || {};
      const code = (data.code || data.error || data.message || "").toString();
      if (code && ERRORS[code]) {
        userMessage = ERRORS[code];
        if (code === "INVALID_TOKEN") {
          isTokenInvalid = true;
        }
      } else {
        switch (response.status) {
          case 401:
            userMessage = ERRORS.INVALID_TOKEN;
            isTokenInvalid = true;
            break;
          case 403:
            userMessage = ERRORS.ACCESS_DENIED;
            isTokenInvalid = true;
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

    if (isTokenInvalid) {
      try {
        await secureStore.removeToken();
        await secureStore.clear();
        store.dispatch(clearAuth());
        Toast.show({
          type: "error",
          text1: "انتهت جلستك",
          text2: "برجاء تسجيل الدخول مرة اخري",
        });
      } catch (e) {
        console.error("Error clearing auth on invalid token:", e);
      }
    }

    (error as any).userMessage = userMessage;
    (error as any).message = userMessage;

    return Promise.reject(error);
  },
);

export default apiClient;
