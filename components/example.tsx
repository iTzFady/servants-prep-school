import React from "react";
import { ResultsListScreen } from "./ResultsListScreen";
import { ResultSummaryScreen } from "./ResultSummaryScreen";
import { ResultDetailsScreen } from "./ResultDetailsScreen";

const results = [
  {
    id: "1",
    title: "اختبار سفر التكوين",
    subtitle: "العهد القديم",
    score: 18,
    total: 20,
    date: "10 أغسطس 2026",
  },
  {
    id: "2",
    title: "اختبار إعداد الخدام",
    subtitle: "المستوى الأول",
    score: 14,
    total: 20,
    date: "5 أغسطس 2026",
  },
];

// List page:
// <ResultsListScreen results={results} onResultPress={(result) => ...} />

// Summary page:
// <ResultSummaryScreen score={18} total={20} onDetailsPress={() => ...} />

// Details page:
// <ResultDetailsScreen
//   questions={[
//     {
//       id: "q1",
//       question: "ما هو أول سفر في الكتاب المقدس؟",
//       selectedAnswer: "التكوين",
//       correctAnswer: "التكوين",
//       isCorrect: true,
//     },
//   ]}
// />
