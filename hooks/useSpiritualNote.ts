import {
  useMutation,
  useQuery,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";

export interface SpiritualNoteSubmissionPayload {
  submission: string[];
}

export interface SpiritualNoteSubmissionRecord {
  date?: string;
  submission?: string[];
  submissions?: string[];
  values?: string[];
  [key: string]: any;
}

const normalizeDate = (value?: string | null): string | null => {
  if (!value || typeof value !== "string") {
    return null;
  }

  return value.includes("T") ? value.split("T")[0] : value;
};

const normalizeSubmissionValues = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    return [value];
  }

  return [];
};

const createEmptyRecord = () => ({
  bible: false,
  morning: false,
  evening: false,
  sleep: false,
  mass: false,
  confession: false,
});

const mapSubmissionValuesToRecord = (values: string[]) => {
  const record = createEmptyRecord();

  values.forEach((submission) => {
    switch (submission) {
      case "BIBLE":
        record.bible = true;
        break;
      case "MORNINGPRAYER":
        record.morning = true;
        break;
      case "NOONPRAYER":
        record.evening = true;
        break;
      case "NIGHTPRAYER":
        record.sleep = true;
        break;
      case "LITURGY":
        record.mass = true;
        break;
      case "CONFESSION":
        record.confession = true;
        break;
      default:
        break;
    }
  });

  return record;
};

const normalizeRecordObject = (
  objectPayload: Record<string, unknown>,
): Record<string, { [key: string]: boolean }> => {
  const records: Record<string, { [key: string]: boolean }> = {};

  Object.entries(objectPayload).forEach(([key, value]) => {
    const date = normalizeDate(key);
    if (!date) {
      return;
    }

    if (Array.isArray(value)) {
      records[date] = mapSubmissionValuesToRecord(
        value.filter((item): item is string => typeof item === "string"),
      );
      return;
    }

    if (value && typeof value === "object") {
      const submissionValues = normalizeSubmissionValues(
        (value as any).submission ||
          (value as any).submissions ||
          (value as any).values,
      );

      if (submissionValues.length > 0) {
        records[date] = mapSubmissionValuesToRecord(submissionValues);
        return;
      }

      records[date] = {
        bible: Boolean((value as any).bible),
        morning: Boolean((value as any).morning),
        evening: Boolean((value as any).evening),
        sleep: Boolean((value as any).sleep),
        mass: Boolean((value as any).mass),
        confession: Boolean((value as any).confession),
      };
      return;
    }
  });

  return records;
};

const mergeSubmissionValuesIntoRecord = (
  record: { [key: string]: boolean },
  values: string[],
) => {
  values.forEach((submission) => {
    switch (submission) {
      case "BIBLE":
        record.bible = true;
        break;
      case "MORNINGPRAYER":
        record.morning = true;
        break;
      case "NOONPRAYER":
        record.evening = true;
        break;
      case "NIGHTPRAYER":
        record.sleep = true;
        break;
      case "LITURGY":
        record.mass = true;
        break;
      case "CONFESSION":
        record.confession = true;
        break;
      default:
        break;
    }
  });
};

export const normalizeSpiritualNoteRecords = (
  payload: unknown,
): Record<string, { [key: string]: boolean }> => {
  const records: Record<string, { [key: string]: boolean }> = {};

  const processItem = (item: SpiritualNoteSubmissionRecord) => {
    if (!item || typeof item !== "object") {
      return;
    }

    const date = normalizeDate(
      item.date || item.createdAt || item.submittedAt || item.day,
    );

    if (!date) {
      return;
    }

    const submissionValues = normalizeSubmissionValues(
      item.submission || item.submissions || item.values,
    );

    if (submissionValues.length === 0) {
      return;
    }

    if (!records[date]) {
      records[date] = createEmptyRecord();
    }

    mergeSubmissionValuesIntoRecord(records[date], submissionValues);
  };

  if (Array.isArray(payload)) {
    payload.forEach(processItem);
    return records;
  }

  if (payload && typeof payload === "object") {
    const payloadObject = payload as Record<string, unknown>;

    if (Array.isArray(payloadObject.data)) {
      return normalizeSpiritualNoteRecords(payloadObject.data);
    }

    if (Array.isArray(payloadObject.submissions)) {
      return normalizeSpiritualNoteRecords(payloadObject.submissions);
    }

    if (
      payloadObject.records &&
      typeof payloadObject.records === "object" &&
      !Array.isArray(payloadObject.records)
    ) {
      return normalizeRecordObject(
        payloadObject.records as Record<string, unknown>,
      );
    }

    return normalizeRecordObject(payloadObject);
  }

  return {};
};

export const useSpiritualNoteSubmissions = (
  month?: string,
): UseQueryResult<Record<string, { [key: string]: boolean }>, Error> => {
  return useQuery({
    queryKey: ["spiritual-note-submissions", month ?? "current"],
    queryFn: async () => {
      const response = await apiClient.get("/v2/spiritual-note/submissions", {
        params: month
          ? {
              month: Number(month.slice(5, 7)),
            }
          : undefined,
      });

      return normalizeSpiritualNoteRecords(response.data);
    },
  });
};

export const useSubmitSpiritualNote = (): UseMutationResult<
  unknown,
  Error,
  SpiritualNoteSubmissionPayload
> => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/v2/spiritual-note", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["spiritual-note-submissions"],
      });
    },
  });
};

// Admin

export const useAdminSpiritualNoteSubmissions = (
  id: string,
  month?: string,
): UseQueryResult<Record<string, { [key: string]: boolean }>, Error> => {
  return useQuery({
    queryKey: ["spiritual-note-submissions", id, month ?? "current"],
    queryFn: async () => {
      const response = await apiClient.get(
        `/v2/spiritual-note/${id}/submissions`,
        {
          params: month
            ? {
                month: Number(month.slice(5, 7)),
              }
            : undefined,
        },
      );

      return normalizeSpiritualNoteRecords(response.data);
    },
  });
};

export const useMarkConfession = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.post(
        "/v2/spiritual-note/confession",
        userId,
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["confession"],
      });
    },
  });
};
