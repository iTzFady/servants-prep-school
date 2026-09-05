import {
  useMutation,
  useQuery,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { User } from "../store/authSlice";
import { apiClient } from "@/services/apiClient";
import { clearAuthSession } from "@/services/authSession";
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
            await apiClient.post("/api/v2/push-notifications", {
              expoPushToken: token,
            });
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.warn("Push token registration failed.");
          } else {
            console.warn("Push token registration failed.");
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

export { clearAuthSession } from "@/services/authSession";

export const useLogout = (): UseMutationResult<void, Error, void> => {
  return useMutation({
    mutationFn: async () => {
      try {
        await apiClient.delete("/api/v2/push-notifications");
      } catch (error) {
        // Keep local auth cleanup resilient even if the server is unavailable.
        console.warn("Remote logout failed; clearing local session.");
      }
    },
    onSuccess: async () => {
      await clearAuthSession();
    },
    onError: async () => {
      await clearAuthSession();
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
  if (Platform.OS === "web") {
    return null;
  }

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
