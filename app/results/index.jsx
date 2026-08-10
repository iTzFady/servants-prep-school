import { useGetProfile } from "@/hooks/useAuth";
import { useResultsStorage } from "@/hooks/useResults";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorIndicator from "@/components/ErrorIndicator";
import { ResultsListScreen } from "@/components/ResultsListScreen";

export default function ResultsPage() {
  const { data: profile, isLoading, error } = useGetProfile();
  const {
    isLoading: isResultsLoading,
    subjects,
    getResultsForStudent,
  } = useResultsStorage();

  const studentResults = getResultsForStudent(profile?.id ?? "");
  const hasResults = subjects.some(
    (subject) =>
      studentResults[subject] !== undefined && studentResults[subject] !== "",
  );

  const results = subjects.map((subject, index) => ({
    id: `${subject}-${index}`,
    title: subject,
    subtitle: profile?.name ? `المخدوم ${profile.name}` : undefined,
    score: Number(studentResults[subject] ?? 0),
    total: 100,
    date: undefined,
  }));

  if (isLoading || isResultsLoading) return <LoadingIndicator />;
  if (error) return <ErrorIndicator state="error" text={error.message} />;
  if (subjects.length === 0)
    return <ErrorIndicator text="لم يتم إضافة مواد بعد." />;
  if (!hasResults) return <ErrorIndicator text="لم يتم إدخال نتائجك بعد." />;

  return <ResultsListScreen results={results} />;
}
