import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useContext, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fonts } from "@/theme/fonts";
import { useAssignment, useSubmitAssignment } from "@/hooks/useAssignment";
import { ThemeContext } from "@/context/ThemeContext";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorIndicator from "@/components/ErrorIndicator";

export default function AssignmentQuestions() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useAssignment(id);
  const submitMutation = useSubmitAssignment();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState({});

  const { theme } = useContext(ThemeContext);
  const dyn = useMemo(
    () => ({
      background: theme.background,
      primary: theme.primary,
      border: theme.borderColor,
      cardBg: theme.secondary,
      textPrimary: theme.title,
      textSecondary: theme.textSecondary,
      buttonBg: theme.primary,
    }),
    [theme],
  );
  const styles = useMemo(() => createStyles(theme), [theme]);

  const questions = data?.questions || [];

  const q = questions[index] || { name: "", answers: [] };

  const goNext = async () => {
    if (index === questions.length - 1) {
      const answers = questions.map((qq) => ({
        questionId: qq.id,
        answerId: selected[qq.id],
      }));
      try {
        await submitMutation.mutateAsync({
          id,
          payload: { assignmentId: id, answers },
        });
        router.back();
      } catch (e) {
        // leaving error handling to the UI; show console for now
        console.error("Submit assignment error", e);
      }
    } else {
      setIndex(index + 1);
    }
  };

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
        <ErrorIndicator state="error" text={error.message} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: dyn.background }]}
      edges={["bottom"]}
    >
      <View style={styles.progressTop}>
        <View>
          <Text style={[styles.small, { color: dyn.textSecondary }]}>
            السؤال {index + 1} من {questions.length || 0}
          </Text>
          <Text style={[styles.title, { color: dyn.textPrimary }]}>
            {/* title from API if available */}
          </Text>
        </View>
        <Text style={[styles.percent, { color: dyn.primary }]}>
          {Math.round(((index + 1) / (questions.length || 1)) * 100)}%
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: dyn.border }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: dyn.primary,
              width: `${((index + 1) / (questions.length || 1)) * 100}%`,
            },
          ]}
        />
      </View>
      <View
        style={[
          styles.question,
          { backgroundColor: dyn.cardBg, borderColor: dyn.border },
        ]}
      >
        <Text
          style={[
            styles.kind,
            { color: dyn.primary, borderColor: dyn.primary },
          ]}
        >
          {q.answers && q.answers.length === 2
            ? "صح أم خطأ"
            : "اختر الإجابة الصحيحة"}
        </Text>
        <Text style={[styles.questionText, { color: dyn.textPrimary }]}>
          {q.name}
        </Text>
        {(q.answers || []).map((choice) => (
          <TouchableOpacity
            onPress={() => setSelected({ ...selected, [q.id]: choice.id })}
            key={choice.id}
            style={[
              styles.choice,
              { borderColor: dyn.border },
              selected[q.id] === choice.id && {
                borderColor: dyn.primary,
                backgroundColor: `${dyn.primary}10`,
              },
            ]}
          >
            <View
              style={[
                styles.radio,
                { borderColor: dyn.border },
                selected[q.id] === choice.id && { borderColor: dyn.primary },
              ]}
            >
              {selected[q.id] === choice.id && (
                <View style={[styles.dot, { backgroundColor: dyn.primary }]} />
              )}
            </View>
            <Text
              style={[
                styles.choiceText,
                { color: dyn.textSecondary },
                selected[q.id] === choice.id && { color: dyn.primary },
              ]}
            >
              {choice.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.footer, { backgroundColor: dyn.cardBg }]}>
        <TouchableOpacity
          disabled={index === 0}
          onPress={() => {
            setIndex(Math.max(0, index - 1));
          }}
          style={[styles.prev, { borderColor: dyn.border }]}
        >
          <Text style={[styles.prevText, { color: dyn.textSecondary }]}>
            السابق
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goNext}
          style={[styles.next, { backgroundColor: dyn.buttonBg }]}
        >
          <Text style={styles.nextText}>
            {index === questions.length - 1 ? "إنهاء" : "التالي"}
          </Text>
          <Feather name="arrow-left" color="#FFF" size={17} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
function createStyles(colors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    progressTop: {
      padding: 24,
      paddingBottom: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    small: {
      fontFamily: fonts.regular,
      color: colors.textSecondary,
      fontSize: 12,
    },
    title: {
      fontFamily: fonts.bold,
      color: colors.title,
      fontSize: 18,
      marginTop: 3,
    },
    percent: { fontFamily: fonts.bold, color: colors.primary, fontSize: 20 },
    track: {
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.borderColor,
      marginHorizontal: 24,
      overflow: "hidden",
    },
    fill: { height: "100%", borderRadius: 5, backgroundColor: colors.primary },
    question: {
      margin: 16,
      padding: 16,
      backgroundColor: colors.secondary,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    kind: {
      fontFamily: fonts.medium,
      color: colors.primary,
      fontSize: 12,
      borderRightWidth: 3,
      borderColor: colors.primary,
      paddingRight: 8,
    },
    questionText: {
      fontFamily: fonts.bold,
      color: colors.title,
      fontSize: 17,
      lineHeight: 30,
      marginVertical: 20,
      textAlign: "right",
    },
    choice: {
      minHeight: 56,
      borderRadius: 9,
      borderWidth: 1,
      borderColor: colors.borderColor,
      paddingHorizontal: 14,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    choiceActive: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}10`,
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.borderColor,
      alignItems: "center",
      justifyContent: "center",
    },
    radioActive: { borderColor: colors.primary },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
    choiceText: {
      fontFamily: fonts.medium,
      color: colors.textSecondary,
      fontSize: 14,
    },
    choiceTextActive: { color: colors.primary },
    footer: {
      marginTop: "auto",
      padding: 16,
      backgroundColor: colors.secondary,
      flexDirection: "row",
      gap: 12,
    },
    prev: {
      height: 56,
      flex: 1,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.borderColor,
      alignItems: "center",
      justifyContent: "center",
    },
    prevText: { fontFamily: fonts.bold, color: colors.textSecondary },
    next: {
      height: 56,
      flex: 1.25,
      borderRadius: 10,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 7,
    },
    nextText: { fontFamily: fonts.bold, color: "#FFF" },
  });
}
