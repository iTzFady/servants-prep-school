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

export interface PendingUser {
  id: string;
  name: string;
}

export interface PendingUsersResponse {
  users: PendingUser[];
}

export const usePendingUsers = (): UseQueryResult<PendingUser[], Error> => {
  return useQuery({
    queryKey: ["pendingUsers"],
    queryFn: async () => {
      const response = await apiClient.get<PendingUsersResponse>(
        "/api/v1/admin/user/pending",
      );
      return response.data.users;
    },
    enabled: true,
  });
};

export interface UserList {
  id: string;
  name: string;
  servantPrepYear: string;
}

export interface UsersListResponse {
  users: UserList[];
}

export const useUsersList = (
  state: boolean,
): UseQueryResult<UserList[], Error> => {
  return useQuery({
    queryKey: ["UsersList"],
    queryFn: async () => {
      const response = await apiClient.get<UserList[]>(
        `/api/v1/admin/user/students?notAttend=${state}`,
      );
      return response.data;
    },
    enabled: true,
  });
};

export interface UserDetail {
  id: string;
  userName: string;
  name: string;
  gender: string;
  birthdate: string;
  address: string;
  role: string;
  whatsapp: string;
  phoneNumber: string;
  homeNumber: string;
  schoolName: string;
  educationType: string;
  educationYear: string;
  confessionFather: string;
  liturgyDate: string;
  servantPrepYear: string;
  serviceType: string;
  registerDate: string;
  status: string;
  pfpUrl?: string;
}

export const useUserDetail = (
  userId: string,
): UseQueryResult<UserDetail, Error> => {
  return useQuery({
    queryKey: ["userDetail", userId],
    queryFn: async () => {
      const response = await apiClient.get<UserDetail>(
        `/api/v1/admin/user/${userId}`,
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useUpdateUserStatus = (
  userId: string,
): UseMutationResult<UserDetail, Error, { status: string }> => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.patch<UserDetail>(
        `/api/v1/admin/user/${userId}/status`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userDetail", userId] });
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

//Attendance

export interface AttendanceAdminPayload {
  id: string;
  status: "PRESENT" | "EXCUSEDLATE" | "UNEXCUSEDLATE";
  note?: string;
}

export const useMarkAttendance = () => {
  return useMutation({
    mutationFn: async (payload: AttendanceAdminPayload) => {
      const response = await apiClient.post(
        "/api/v1/attendance/admin",
        payload,
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance"],
      });
    },
  });
};

export const useAdminAttendance = (
  id: string,
): UseQueryResult<AttendanceResponse, Error> => {
  return useQuery({
    queryKey: ["attendance", id],
    queryFn: async () => {
      const response = await apiClient.get<AttendanceResponse>(
        `/api/v1/attendance/admin/${id}`,
      );
      return response.data;
    },
    enabled: true,
  });
};

export interface BulkAttendancePayload {
  userIds: string[];
}

export const useBulkAttendance = (): UseMutationResult<
  void,
  Error,
  BulkAttendancePayload
> => {
  return useMutation({
    mutationFn: async (payload) => {
      await apiClient.post("/api/v1/attendance/admin/bulk", payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance"],
      });

      queryClient.invalidateQueries({
        queryKey: ["UsersList"],
      });
    },
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

export interface UploadLecturePayload {
  title: string;
  subject: string;
  date: Date | string;
  file: any;
}

export const useUploadLecture = (): UseMutationResult<
  Lecture,
  Error,
  UploadLecturePayload
> => {
  return useMutation({
    mutationFn: async (data: UploadLecturePayload) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("subject", data.subject);
      formData.append(
        "date",
        data.date instanceof Date ? data.date.toISOString() : data.date,
      );
      formData.append("file", data.file);

      const response = await apiClient.post<Lecture>(
        "/api/v1/lectures",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 0,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
    },
  });
};
