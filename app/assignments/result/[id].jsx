import { useLocalSearchParams } from "expo-router";
import React, { useContext, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { fonts } from "@/theme/fonts";
import { useAssignmentResult } from "@/hooks/useAssignment";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorIndicator from "@/components/ErrorIndicator";
import { ThemeContext } from "@/context/ThemeContext";

export default function AssignmentResultPage() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useAssignmentResult(id);

  const { theme } = useContext(ThemeContext);
  const dyn = useMemo(
    () => ({
      background: theme.background,
      cardBg: theme.secondary,
      titleColor: theme.title,
      textSecondary: theme.textSecondary,
      primary: theme.primary,
    }),
    [theme],
  );
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.screen, { backgroundColor: dyn.background }]}
        edges={["bottom"]}
      >
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.screen, { backgroundColor: dyn.background }]}
        edges={["bottom"]}
      >
        <ErrorIndicator
          state="error"
          text={error?.message || "حدث خطأ أثناء جلب النتيجة."}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  const result = data || {};

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: dyn.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: dyn.titleColor }]}>
          {result.title || "نتيجة الواجب"}
        </Text>
        <View style={[styles.summary, { backgroundColor: dyn.cardBg }]}>
          <Text style={[styles.summaryText, { color: dyn.textSecondary }]}>
            النقاط: {result.score ?? "-"} / {result.total ?? "-"}
          </Text>
          {typeof result.percentage !== "undefined" && (
            <Text style={[styles.summaryText, { color: dyn.textSecondary }]}>
              النسبة: {result.percentage}%
            </Text>
          )}
        </View>

        {(result.questions || []).map((q, idx) => (
          <View
            style={[styles.question, { backgroundColor: dyn.cardBg }]}
            key={q.id || idx}
          >
            <Text
              style={[styles.qTitle, { color: dyn.titleColor }]}
            >{`${idx + 1}. ${q.name || q.title || "سؤال"}`}</Text>
            <Text style={[styles.qMeta, { color: dyn.textSecondary }]}>
              إجابتك: {q.selectedText ?? q.selected ?? "-"}
            </Text>
            <Text style={[styles.qMeta, { color: dyn.textSecondary }]}>
              الإجابة الصحيحة: {q.correctText ?? q.correct ?? "-"}
            </Text>
            <Text
              style={[
                styles.qStatus,
                q.isCorrect ? styles.correct : styles.wrong,
              ]}
            >
              {q.isCorrect ? "صحيح" : "خاطئ"}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { padding: 16, paddingBottom: 40 },
    title: {
      fontFamily: fonts.bold,
      fontSize: 18,
      color: colors.title,
      marginBottom: 12,
    },
    summary: {
      backgroundColor: colors.secondary,
      padding: 12,
      borderRadius: 10,
      marginBottom: 12,
    },
    summaryText: {
      fontFamily: fonts.medium,
      color: colors.textSecondary,
      fontSize: 14,
    },
    question: {
      backgroundColor: colors.secondary,
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
    },
    qTitle: {
      fontFamily: fonts.bold,
      color: colors.title,
      fontSize: 14,
      marginBottom: 6,
    },
    qMeta: {
      fontFamily: fonts.regular,
      color: colors.textSecondary,
      fontSize: 12,
    },
    qStatus: { marginTop: 8, fontFamily: fonts.bold, fontSize: 12 },
    correct: { color: "#16A34A" },
    wrong: { color: colors.primary },
  });
}
