import { secureStore } from "@/services/secureStore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const SUBJECTS_KEY = "resultsSubjects";
const RESULTS_KEY = "studentResults";

export interface StudentResults {
  [subject: string]: string;
}

export interface ResultsByStudent {
  [studentId: string]: StudentResults;
}

type ResultsContextValue = {
  subjects: string[];
  studentResults: ResultsByStudent;
  isLoading: boolean;
  addSubject: (subject: string) => Promise<void>;
  removeSubject: (subject: string) => Promise<void>;
  saveResultsForStudent: (
    studentId: string,
    results: StudentResults,
  ) => Promise<void>;
  getResultsForStudent: (studentId: string) => StudentResults;
};

const ResultsContext = createContext<ResultsContextValue | null>(null);

export function ResultsProvider({ children }: { children: React.ReactNode }) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [studentResults, setStudentResults] = useState<ResultsByStudent>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const [subjectsJson, resultsJson] = await Promise.all([
          secureStore.getItem(SUBJECTS_KEY),
          secureStore.getItem(RESULTS_KEY),
        ]);
        if (!active) return;
        setSubjects(subjectsJson ? JSON.parse(subjectsJson) : []);
        setStudentResults(resultsJson ? JSON.parse(resultsJson) : {});
      } catch (error) {
        console.error("Error loading results storage:", error);
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const addSubject = useCallback(
    async (subject: string) => {
      const trimmed = subject.trim();
      if (!trimmed || subjects.includes(trimmed)) return;
      const nextSubjects = [...subjects, trimmed];
      setSubjects(nextSubjects);
      try {
        await secureStore.setItem(SUBJECTS_KEY, JSON.stringify(nextSubjects));
      } catch (error) {
        setSubjects(subjects);
        throw error;
      }
    },
    [subjects],
  );

  const removeSubject = useCallback(
    async (subject: string) => {
      const nextSubjects = subjects.filter((item) => item !== subject);
      setSubjects(nextSubjects);
      try {
        await secureStore.setItem(SUBJECTS_KEY, JSON.stringify(nextSubjects));
      } catch (error) {
        setSubjects(subjects);
        throw error;
      }
    },
    [subjects],
  );

  const saveResultsForStudent = useCallback(
    async (studentId: string, results: StudentResults) => {
      const nextResults = { ...studentResults, [studentId]: results };
      setStudentResults(nextResults);
      try {
        await secureStore.setItem(RESULTS_KEY, JSON.stringify(nextResults));
      } catch (error) {
        setStudentResults(studentResults);
        throw error;
      }
    },
    [studentResults],
  );

  const getResultsForStudent = useCallback(
    (studentId: string) => studentResults[studentId] || {},
    [studentResults],
  );

  const value = useMemo(
    () => ({
      subjects,
      studentResults,
      isLoading,
      addSubject,
      removeSubject,
      saveResultsForStudent,
      getResultsForStudent,
    }),
    [
      subjects,
      studentResults,
      isLoading,
      addSubject,
      removeSubject,
      saveResultsForStudent,
      getResultsForStudent,
    ],
  );
  return (
    <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>
  );
}

export function useResultsStore() {
  const context = useContext(ResultsContext);
  if (!context)
    throw new Error("useResultsStorage must be used within ResultsProvider");
  return context;
}
