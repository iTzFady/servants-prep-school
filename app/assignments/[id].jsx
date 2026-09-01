import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fonts } from "@/theme/fonts";
import useAssignment from "@/hooks/useAssignment";

export default function AssignmentQuestions() {
  const { id } = useLocalSearchParams();
  const { getAssignment, submitAssignment } = useAssignment();
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    getAssignment(id)
      .then((data) => {
        if (!mounted) return;
        // Expecting API: { questions: [{ id, name, answers: [{ id, text }] }, ...], title }
        setQuestions((data && data.questions) || []);
      })
      .catch(() => {});
    return () => (mounted = false);
  }, [id, getAssignment]);

  const q = questions[index] || { name: "", answers: [] };

  const goNext = async () => {
    if (index === questions.length - 1) {
      // submit
      const answers = questions.map((qq) => ({
        questionId: qq.id,
        answerId: selected[qq.id],
      }));
      try {
        await submitAssignment(id, { assignmentId: id, answers });
      } catch (e) {
        // ignore for now; API client will surface errors
      }
      router.back();
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <View style={styles.progressTop}>
        <View>
          <Text style={styles.small}>
            السؤال {index + 1} من {questions.length || 0}
          </Text>
          <Text style={styles.title}>{/* title from API if available */}</Text>
        </View>
        <Text style={styles.percent}>
          {Math.round(((index + 1) / (questions.length || 1)) * 100)}%
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${((index + 1) / (questions.length || 1)) * 100}%` },
          ]}
        />
      </View>
      <View style={styles.question}>
        <Text style={styles.kind}>
          {q.answers && q.answers.length === 2 ? "صح أم خطأ" : "اختر الإجابة الصحيحة"}
        </Text>
        <Text style={styles.questionText}>{q.name}</Text>
        {(q.answers || []).map((choice) => (
          <TouchableOpacity
            onPress={() => setSelected({ ...selected, [q.id]: choice.id })}
            key={choice.id}
            style={[
              styles.choice,
              selected[q.id] === choice.id && styles.choiceActive,
            ]}
          >
            <View style={[styles.radio, selected[q.id] === choice.id && styles.radioActive]}>
              {selected[q.id] === choice.id && <View style={styles.dot} />}
            </View>
            <Text
              style={[
                styles.choiceText,
                selected[q.id] === choice.id && styles.choiceTextActive,
              ]}
            >
              {choice.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={index === 0}
          onPress={() => {
            setIndex(Math.max(0, index - 1));
          }}
          style={styles.prev}
        >
          <Text style={styles.prevText}>السابق</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goNext} style={styles.next}>
          <Text style={styles.nextText}>
            {index === questions.length - 1 ? "إنهاء" : "التالي"}
          </Text>
          <Feather name="arrow-left" color="#FFF" size={17} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC" },
  progressTop: {
    padding: 24,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  small: { fontFamily: fonts.regular, color: "#64748B", fontSize: 12 },
  title: {
    fontFamily: fonts.bold,
    color: "#1E293B",
    fontSize: 18,
    marginTop: 3,
  },
  percent: { fontFamily: fonts.bold, color: "#B51D36", fontSize: 20 },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 24,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 5, backgroundColor: "#B51D36" },
  question: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  kind: {
    fontFamily: fonts.medium,
    color: "#B51D36",
    fontSize: 12,
    borderRightWidth: 3,
    borderColor: "#B51D36",
    paddingRight: 8,
  },
  questionText: {
    fontFamily: fonts.bold,
    color: "#1E293B",
    fontSize: 17,
    lineHeight: 30,
    marginVertical: 20,
    textAlign: "right",
  },
  choice: {
    minHeight: 56,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  choiceActive: { borderColor: "#B51D36", backgroundColor: "#FFF6F7" },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: "#B51D36" },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#B51D36" },
  choiceText: { fontFamily: fonts.medium, color: "#475569", fontSize: 14 },
  choiceTextActive: { color: "#B51D36" },
  footer: {
    marginTop: "auto",
    padding: 16,
    backgroundColor: "#FFF",
    flexDirection: "row",
    gap: 12,
  },
  prev: {
    height: 56,
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  prevText: { fontFamily: fonts.bold, color: "#64748B" },
  next: {
    height: 56,
    flex: 1.25,
    borderRadius: 10,
    backgroundColor: "#B51D36",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },
  nextText: { fontFamily: fonts.bold, color: "#FFF" },
});
