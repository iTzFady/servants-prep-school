import {
  useMutation,
  useQuery,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";

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
