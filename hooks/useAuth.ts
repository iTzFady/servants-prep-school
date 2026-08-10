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
