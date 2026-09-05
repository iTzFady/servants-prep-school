import apiClient from "@/services/apiClient";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAssignments = () => {
  return useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v2/assignment");
      return res.data;
    },
  });
};

export const useAssignment = (id: string | number) => {
  return useQuery({
    queryKey: ["assignment", id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v2/assignment/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useSubmitAssignment = () => {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string | number;
      payload: any;
    }) => {
      const res = await apiClient.post(`/api/v2/assignment/${id}`, payload);
      return res.data;
    },
  });
};

export const useAssignmentResult = (id: string | number) => {
  return useQuery({
    queryKey: ["assignment-result", id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v2/assignment/result/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useAdminCreateAssignment = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      console.log("payload", payload);
      const res = await apiClient.post(
        "/api/v2/admin/assignment/create",
        payload,
      );
      return res.data;
    },
  });
};

export const useAdminNotifyAssignment = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.post(
        "/api/v2/admin/assignment/notify",
        payload,
      );
      return res.data;
    },
  });
};
