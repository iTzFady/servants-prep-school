import {
  useMutation,
  useQuery,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { User } from "../store/authSlice";
import { apiClient } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import { secureStore } from "@/services/secureStore";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import axios from "axios";

// Auth
interface LoginPayload {
  userName: string;
  password: string;
}

interface AuthResponse {
  token: string;
  userResponse: User;
}

export const useLogin = (): UseMutationResult<
  AuthResponse,
  Error,
  LoginPayload
> => {
  return useMutation({
    mutationFn: async (credentials: LoginPayload) => {
      const response = await apiClient.post<AuthResponse>(
        "/api/v1/auth/login",
        credentials,
      );
      return response.data;
    },
    onSuccess: async (data) => {
      await Promise.all([
        secureStore.setToken(data.token),
        secureStore.setUser(data.userResponse),
      ]);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      await registerPushToken().then(async (token) => {
        try {
          if (token) {
            await apiClient.post("/api/v2/push-notifications", {"expoPushToken": token });
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);
            console.log("HEADERS:", error.response?.headers);
            console.log("URL:", error.config?.url);
          }
          else {
            console.log("Error:", error);
          }
        }
      });
    },
  });
};

export const useRegister = (): UseMutationResult<AuthResponse, Error, any> => {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await apiClient.post<AuthResponse>(
        "/api/v1/auth/register",
        userData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
  });
};

export const useLogout = (): UseMutationResult<void, Error, void> => {
  return useMutation({
    mutationFn: async () => {
      // await apiClient.post("/auth/logout");
    },
    onSuccess: async () => {
      await secureStore.clear();
      queryClient.clear();
    },
  });
};

export const useGetProfile = (): UseQueryResult<User, Error> => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await apiClient.get<User>("/api/v1/user/");
      return response.data;
    },
    enabled: true,
  });
};

async function registerPushToken(): Promise<string | null> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  let finalStatus = current.status;

  if (finalStatus !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    finalStatus = requested.status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    throw new Error("EAS project ID is missing");
  }

  return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
}
