import { useCallback, useEffect, useState } from "react";
import { secureStore } from "@/services/secureStore";

const SUBJECTS_KEY = "resultsSubjects";
const RESULTS_KEY = "studentResults";

export interface StudentResults {
  [subject: string]: string;
}

export interface ResultsByStudent {
  [studentId: string]: StudentResults;
}

export function useResultsStorage() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [studentResults, setStudentResults] = useState<ResultsByStudent>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFromStorage() {
      try {
        const subjectsJson = await secureStore.getItem(SUBJECTS_KEY);
        const resultsJson = await secureStore.getItem(RESULTS_KEY);

        if (!isMounted) return;

        setSubjects(subjectsJson ? JSON.parse(subjectsJson) : []);
        setStudentResults(resultsJson ? JSON.parse(resultsJson) : {});
      } catch (error) {
        console.error("Error loading results storage:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadFromStorage();

    return () => {
      isMounted = false;
    };
  }, []);

  const persistSubjects = useCallback(async (nextSubjects: string[]) => {
    try {
      setSubjects(nextSubjects);
      await secureStore.setItem(SUBJECTS_KEY, JSON.stringify(nextSubjects));
    } catch (error) {
      console.error("Error saving subjects:", error);
    }
  }, []);

  const persistStudentResults = useCallback(
    async (nextResults: ResultsByStudent) => {
      try {
        setStudentResults(nextResults);
        await secureStore.setItem(RESULTS_KEY, JSON.stringify(nextResults));
      } catch (error) {
        console.error("Error saving student results:", error);
      }
    },
    [],
  );

  const addSubject = useCallback(
    async (subject: string) => {
      const trimmed = subject.trim();
      if (!trimmed || subjects.includes(trimmed)) return;
      await persistSubjects([...subjects, trimmed]);
    },
    [subjects, persistSubjects],
  );

  const removeSubject = useCallback(
    async (subject: string) => {
      await persistSubjects(subjects.filter((item) => item !== subject));
    },
    [subjects, persistSubjects],
  );

  const saveResultsForStudent = useCallback(
    async (studentId: string, results: StudentResults) => {
      const nextResults = {
        ...studentResults,
        [studentId]: results,
      };
      await persistStudentResults(nextResults);
    },
    [studentResults, persistStudentResults],
  );

  const getResultsForStudent = useCallback(
    (studentId: string) => studentResults[studentId] || {},
    [studentResults],
  );

  return {
    subjects,
    studentResults,
    isLoading,
    addSubject,
    removeSubject,
    saveResultsForStudent,
    getResultsForStudent,
  };
}
