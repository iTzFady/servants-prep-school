import {
  useMutation,
  useQuery,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";

export interface PendingUser {
  id: string;
  name: string;
}

export interface PendingUsersResponse {
  users: PendingUser[];
}

export interface UserList {
  id: string;
  name: string;
  servantPrepYear: string;
}

export interface UsersListResponse {
  users: UserList[];
}

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

export const usePendingUsers = (): UseQueryResult<PendingUser[], Error> => {
  return useQuery({
    queryKey: ["pendingUsers"],
    queryFn: async () => {
      const response = await apiClient.get<PendingUsersResponse>(
        "/v1/admin/user/pending",
      );
      return response.data.users;
    },
    enabled: true,
  });
};

export const useUsersList = (
  state: boolean,
): UseQueryResult<UserList[], Error> => {
  return useQuery({
    queryKey: ["UsersList"],
    queryFn: async () => {
      const response = await apiClient.get<UserList[]>(
        `/v1/admin/user/students?notAttend=${state}`,
      );
      return response.data;
    },
    enabled: true,
  });
};

export const useUserDetail = (
  userId: string,
): UseQueryResult<UserDetail, Error> => {
  return useQuery({
    queryKey: ["userDetail", userId],
    queryFn: async () => {
      const response = await apiClient.get<UserDetail>(
        `/v1/admin/user/${userId}`,
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
        `/v1/admin/user/${userId}/status`,
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
