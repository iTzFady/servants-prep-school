import {
  useMutation,
  useQuery,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";

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

export const useAttendance = (): UseQueryResult<AttendanceResponse, Error> => {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const response =
        await apiClient.get<AttendanceResponse>("/v1/attendance/");
      return response.data;
    },
    enabled: true,
  });
};

//Admin

export interface AttendanceAdminPayload {
  id: string;
  status: "PRESENT" | "EXCUSEDLATE" | "UNEXCUSEDLATE";
  note?: string;
}

export const useMarkAttendance = () => {
  return useMutation({
    mutationFn: async (payload: AttendanceAdminPayload) => {
      const response = await apiClient.post("/v1/attendance/admin", payload);
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
        `/v1/attendance/admin/${id}`,
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
      await apiClient.post("/v1/attendance/admin/bulk", payload);
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
