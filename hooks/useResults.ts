import { apiClient } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import {
  useMutation,
  useQuery,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { SubjectTabs } from "@/data/subjects";
import { Term } from "./useTerm";

export type StudentResults = Record<string, string | number>;
export type ResultsByStudent = Record<string, StudentResults>;

export interface Subject {
  subjectName:
    | "BIBLE"
    | "SERVICE_TOPICS"
    | "DOCTRINE"
    | "CHURCH_HISTORY"
    | "RITUALS"
    | "HYMNS";
  score: number;
}

export interface ResultsResponse {
  subject: string;
  score: number;
  date: Date;
  term: Term;
}

export const useCreateResults = () => {
  return useMutation({
    mutationFn: async (payload: { userId: string; subject: Subject[] }) => {
      const response = await apiClient.post("/api/v2/admin/results", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["results"],
      });
    },
  });
};

export const useResults = (): UseQueryResult<ResultsResponse[], Error> => {
  return useQuery({
    queryKey: ["results"],
    queryFn: async () => {
      const response =
        await apiClient.get<ResultsResponse[]>("/api/v2/results");
      return response.data;
    },
    enabled: true,
  });
};

export const useAdminResults = (
  id: string,
): UseQueryResult<ResultsResponse[], Error> => {
  return useQuery({
    queryKey: ["results", id],
    queryFn: async () => {
      const response = await apiClient.get<ResultsResponse[]>(
        `/api/v2/admin/results/${id}`,
      );
      return response.data;
    },
    enabled: true,
  });
};
