import {
  useMutation,
  useQuery,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import { secureStore } from "@/services/secureStore";
import { User } from "../store/authSlice";

// Auth
interface LoginPayload {
  userName: string;
  password: string;
}

interface AuthResponse {
  token: string;
  userResponse: User;
}

// Attendance

export interface AttendanceCount {
  present: number;
  absent: number;
  excusedLate: number;
  unexcusedLate: number;
}

export interface AttendanceRecord {
  id: string;
  status: "PRESENT" | "ABSENT" | "EXCUSEDLATE" | "UNEXCUSEDLATE" | string;
  date: string;
  time?: string | null;
}

export interface AttendanceResponse {
  attendanceRecords: AttendanceRecord[];
  count: AttendanceCount;
}

// Lectures
export interface Lecture {
  id: string;
  title: string;
  type: string;
  date: string;
  path: string;
  subject: string;
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

export const useAttendance = (): UseQueryResult<AttendanceResponse, Error> => {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const response = await apiClient.get<AttendanceResponse>(
        "/api/v1/attendance/",
      );
      return response.data;
    },
    enabled: true,
  });
};

export const useLectures = (
  subject: string,
): UseQueryResult<Lecture[], Error> => {
  return useQuery({
    queryKey: ["lectures", subject],
    queryFn: async () => {
      const response = await apiClient.get<Lecture[]>(
        `/api/v1/lectures/${subject}`,
      );
      return response.data;
    },
    enabled: !!subject,
  });
};

export interface LectureDetail extends Lecture {
  lectureUrl: string;
}

export const useLectureDetail = (
  subject: string,
  lectureId: string,
): UseQueryResult<LectureDetail, Error> => {
  return useQuery({
    queryKey: ["lecture", subject, lectureId],
    queryFn: async () => {
      const response = await apiClient.get<LectureDetail>(
        `/api/v1/lectures/${subject}?lectureId=${lectureId}`,
      );
      return response.data;
    },
    enabled: !!subject && !!lectureId,
  });
};

export const useGetProfile = (): UseQueryResult<User, Error> => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await apiClient.get<User>("api/v1/user/");
      return response.data;
    },
    enabled: true,
  });
};

// Not implemented
export const useUpdateProfile = (): UseMutationResult<
  User,
  Error,
  Partial<User>
> => {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await apiClient.put<User>("api/v1/user/", userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
};

export const useGet = <T>(
  endpoint: string,
  queryKey: string[],
  enabled: boolean = true,
): UseQueryResult<T, Error> => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get<T>(endpoint);
      return response.data;
    },
    enabled,
  });
};

export const useApiMutation = <T, V>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  endpoint: string,
  invalidateKeys?: string[][],
): UseMutationResult<T, Error, V> => {
  return useMutation({
    mutationFn: async (data: V) => {
      const response = await apiClient({
        method: method.toLowerCase() as any,
        url: endpoint,
        data,
      });
      return response.data;
    },
    onSuccess: () => {
      if (invalidateKeys) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
  });
};
