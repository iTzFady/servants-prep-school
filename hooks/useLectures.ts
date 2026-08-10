import {
  useMutation,
  useQuery,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";

export interface Lecture {
  id: string;
  title: string;
  type: string;
  date: string;
  path: string;
  subject: string;
}

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

// Admin
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

      const response = await apiClient.post<Lecture>("/api/v1/lectures", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 0,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
    },
  });
};
