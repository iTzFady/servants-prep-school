import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { QuestionResult } from "./ResultsTypes";

const COLORS = {
  primary: "#A71E34",
  primarySoft: "#F7E9EC",
  text: "#20242A",
  muted: "#737983",
  border: "#E5E7EB",
  background: "#F1F5F9",
  white: "#FFFFFF",
  success: "#2E8B57",
  successSoft: "#EAF6EF",
  danger: "#C0392B",
  dangerSoft: "#FBEDEC",
};

type Props = {
  title?: string;
  questions: QuestionResult[];
};

export function ResultDetailsScreen({
  title = "تفاصيل النتيجة",
  questions,
}: Props) {
  const correct = questions.filter((q) => q.isCorrect).length;
  const percentage = questions.length
    ? Math.round((correct / questions.length) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.summary}>
              <View style={styles.summaryScore}>
                <Text style={styles.summaryPercent}>{percentage}%</Text>
                <Text style={styles.summaryCaption}>
                  {correct} / {questions.length}
                </Text>
              </View>

              <View style={styles.summaryText}>
                <Text style={styles.summaryTitle}>ملخص الإجابات</Text>
                <Text style={styles.summarySubtitle}>
                  راجع إجاباتك لمعرفة نقاط القوة والنقاط التي تحتاج إلى مراجعة.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>تفاصيل الأسئلة</Text>
          </>
        }
        renderItem={({ item, index }) => (
          <QuestionResultCard question={item} index={index + 1} />
        )}
      />
    </SafeAreaView>
  );
}

function QuestionResultCard({
  question,
  index,
}: {
  question: QuestionResult;
  index: number;
}) {
  const ok = question.isCorrect;

  return (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <View
          style={[
            styles.resultIcon,
            { backgroundColor: ok ? COLORS.successSoft : COLORS.dangerSoft },
          ]}
        >
          <Text
            style={[
              styles.resultIconText,
              { color: ok ? COLORS.success : COLORS.danger },
            ]}
          >
            {ok ? "✓" : "×"}
          </Text>
        </View>

        <Text style={styles.questionNumber}>السؤال {index}</Text>
      </View>

      <Text style={styles.question}>{question.question}</Text>

      {!!question.selectedAnswer && (
        <AnswerRow
          label="إجابتك"
          value={question.selectedAnswer}
          correct={ok}
        />
      )}

      {!ok && (
        <AnswerRow
          label="الإجابة الصحيحة"
          value={question.correctAnswer}
          correct
        />
      )}
    </View>
  );
}

function AnswerRow({
  label,
  value,
  correct,
}: {
  label: string;
  value: string;
  correct: boolean;
}) {
  return (
    <View
      style={[
        styles.answerRow,
        { backgroundColor: correct ? COLORS.successSoft : COLORS.dangerSoft },
      ]}
    >
      <View
        style={[
          styles.answerDot,
          { backgroundColor: correct ? COLORS.success : COLORS.danger },
        ]}
      />
      <View style={styles.answerText}>
        <Text style={styles.answerLabel}>{label}</Text>
        <Text style={styles.answerValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  title: {
    color: COLORS.text,
    fontSize: 23,
    fontWeight: "900",
    textAlign: "right",
    marginBottom: 16,
  },
  summary: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  summaryScore: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryPercent: {
    color: COLORS.primary,
    fontSize: 19,
    fontWeight: "900",
  },
  summaryCaption: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 2,
  },
  summaryText: {
    flex: 1,
    marginRight: 14,
    alignItems: "flex-end",
  },
  summaryTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "right",
  },
  summarySubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: "right",
    marginTop: 4,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "right",
    marginTop: 22,
    marginBottom: 10,
  },
  questionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginBottom: 11,
  },
  questionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  questionNumber: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  resultIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  resultIconText: {
    fontSize: 17,
    fontWeight: "900",
  },
  question: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 12,
  },
  answerRow: {
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  answerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginLeft: 9,
  },
  answerText: {
    flex: 1,
    alignItems: "flex-end",
  },
  answerLabel: {
    color: COLORS.muted,
    fontSize: 9,
    textAlign: "right",
  },
  answerValue: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 2,
  },
});
