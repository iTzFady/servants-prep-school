import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { fonts } from "@/theme/fonts";
import { useAssignment } from "@/hooks/useAssignment";
import { ThemeContext } from "@/context/ThemeContext";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorIndicator from "@/components/ErrorIndicator";

export default function AdminAssignmentPreview() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useAssignment(id);
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);

  const questions = data?.questions || [];

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.screen, { backgroundColor: theme.background }]}
        edges={["bottom"]}
      >
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.screen, { backgroundColor: theme.background }]}
        edges={["bottom"]}
      >
        <ErrorIndicator state="error" text={error.message} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: theme.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.title }]}>
            {data?.title || "الواجب"}
          </Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>
            {data?.subject || "-"}
          </Text>
        </View>

        {questions.map((question, index) => (
          <View
            key={question.id || index}
            style={[
              styles.questionCard,
              {
                backgroundColor: theme.secondary,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <Text style={[styles.questionNumber, { color: theme.title }]}>
              السؤال {index + 1}
            </Text>
            <Text style={[styles.questionText, { color: theme.title }]}>
              {question.name}
            </Text>

            {(question.answers || []).map((answer, answerIndex) => (
              <View
                key={answer.id || `${question.id}-${answerIndex}`}
                style={[
                  styles.answerRow,
                  {
                    borderColor: answer.isCorrect
                      ? theme.primary
                      : theme.borderColor,
                    backgroundColor: answer.isCorrect
                      ? `${theme.primary}18`
                      : "transparent",
                  },
                ]}
              >
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: answer.isCorrect
                        ? theme.primary
                        : theme.borderColor,
                      backgroundColor: answer.isCorrect
                        ? theme.primary
                        : "transparent",
                    },
                  ]}
                >
                  {answer.isCorrect ? (
                    <Feather name="check" size={12} color="#fff" />
                  ) : null}
                </View>
                <Text style={[styles.answerText, { color: theme.title }]}>
                  {answer.text}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    screen: { flex: 1 },
    content: {
      padding: 16,
      paddingBottom: 40,
    },
    header: {
      marginBottom: 16,
    },
    title: {
      fontFamily: fonts.bold,
      fontSize: 20,
      marginBottom: 4,
    },
    meta: {
      fontFamily: fonts.regular,
      fontSize: 12,
    },
    questionCard: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 14,
      marginBottom: 14,
    },
    questionNumber: {
      fontFamily: fonts.bold,
      fontSize: 14,
      marginBottom: 8,
    },
    questionText: {
      fontFamily: fonts.bold,
      fontSize: 16,
      marginBottom: 12,
      lineHeight: 24,
    },
    answerRow: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 8,
    },
    radio: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },
    answerText: {
      fontFamily: fonts.regular,
      fontSize: 14,
      flex: 1,
    },
  });
}
