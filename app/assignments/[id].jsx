import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fonts } from "@/theme/fonts";
const questions = [
  {
    title: "ما هو المقصود بكلمة عقيدة؟",
    choices: [
      "الإيمان والتعليم المسيحي",
      "مجرد معلومات تاريخية",
      "طقوس الكنيسة فقط",
      "دراسة الألحان",
    ],
  },
  { title: "الكنيسة جسد المسيح الحي.", choices: ["صح", "خطأ"] },
];
export default function AssignmentQuestions() {
  const { id } = useLocalSearchParams();
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState();
  const q = questions[index];
  const next = () =>
    index === questions.length - 1
      ? router.back()
      : (setIndex(index + 1), setAnswer(undefined));
  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <View style={styles.progressTop}>
        <View>
          <Text style={styles.small}>
            السؤال {index + 1} من {questions.length}
          </Text>
          <Text style={styles.title}>
            {id === "hymns" ? "واجب الألحان" : "واجب العقيدة"}
          </Text>
        </View>
        <Text style={styles.percent}>
          {Math.round(((index + 1) / questions.length) * 100)}%
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${((index + 1) / questions.length) * 100}%` },
          ]}
        />
      </View>
      <View style={styles.question}>
        <Text style={styles.kind}>
          {q.choices.length === 2 ? "صح أم خطأ" : "اختر الإجابة الصحيحة"}
        </Text>
        <Text style={styles.questionText}>{q.title}</Text>
        {q.choices.map((choice, i) => (
          <TouchableOpacity
            onPress={() => setAnswer(i)}
            key={choice}
            style={[styles.choice, answer === i && styles.choiceActive]}
          >
            <View style={[styles.radio, answer === i && styles.radioActive]}>
              {answer === i && <View style={styles.dot} />}
            </View>
            <Text
              style={[
                styles.choiceText,
                answer === i && styles.choiceTextActive,
              ]}
            >
              {choice}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={index === 0}
          onPress={() => {
            setIndex(index - 1);
            setAnswer(undefined);
          }}
          style={styles.prev}
        >
          <Text style={styles.prevText}>السابق</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={next} style={styles.next}>
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
