export type ResultStatus = "excellent" | "good" | "needsReview";

export type ResultItem = {
  id: string;
  title: string;
  subtitle?: string;
  score: number;
  total: number;
  date?: string;
  status?: ResultStatus;
};

export type QuestionResult = {
  id: string;
  question: string;
  selectedAnswer?: string;
  correctAnswer: string;
  isCorrect: boolean;
};
