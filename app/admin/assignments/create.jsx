import React, { useContext, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { fonts } from "@/theme/fonts";
import { useAdminCreateAssignment } from "@/hooks/useAssignment";
import { ThemeContext } from "@/context/ThemeContext";
import { assignmentSubjects } from "@/data/assignments";
import CustomDropdown from "@/components/CustomDropdown";
import { router } from "expo-router";
import dateUtils from "@/utils/dateFormatter";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import InputField from "@/components/InputField";
import Toast from "react-native-toast-message";
import Button from "@/components/Button";

const createEmptyQuestion = () => ({
  name: "",
  answers: [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
});

export default function CreateAssignment() {
  const { theme } = useContext(ThemeContext);
  const createMutation = useAdminCreateAssignment();
  const isSubmitting = createMutation.isPending;
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDate, setShowEndDate] = useState(false);
  const [questions, setQuestions] = useState([createEmptyQuestion()]);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const updateQuestion = (qIndex, field, value) => {
    setQuestions((current) =>
      current.map((question, index) =>
        index === qIndex ? { ...question, [field]: value } : question,
      ),
    );
  };

  const updateAnswer = (qIndex, aIndex, field, value) => {
    setQuestions((current) =>
      current.map((question, questionIndex) => {
        if (questionIndex !== qIndex) return question;

        return {
          ...question,
          answers: question.answers.map((answer, answerIndex) =>
            answerIndex === aIndex ? { ...answer, [field]: value } : answer,
          ),
        };
      }),
    );
  };

  const setCorrectAnswer = (qIndex, aIndex) => {
    setQuestions((current) =>
      current.map((question, questionIndex) => {
        if (questionIndex !== qIndex) return question;

        return {
          ...question,
          answers: question.answers.map((answer, answerIndex) => ({
            ...answer,
            isCorrect: answerIndex === aIndex,
          })),
        };
      }),
    );
  };

  const addQuestion = () => {
    setQuestions((current) => [...current, createEmptyQuestion()]);
  };

  const addAnswer = (qIndex) => {
    setQuestions((current) =>
      current.map((question, questionIndex) => {
        if (questionIndex !== qIndex) return question;
        if (question.answers.length >= 4) return question;

        return {
          ...question,
          answers: [...question.answers, { text: "", isCorrect: false }],
        };
      }),
    );
  };

  const removeQuestion = (qIndex) => {
    setQuestions((current) =>
      current.length > 1
        ? current.filter((_, index) => index !== qIndex)
        : current,
    );
  };

  const removeAnswer = (qIndex, aIndex) => {
    setQuestions((current) =>
      current.map((question, questionIndex) => {
        if (questionIndex !== qIndex) return question;

        const nextAnswers = question.answers.filter(
          (_, index) => index !== aIndex,
        );
        if (nextAnswers.length === 0) {
          return {
            ...question,
            answers: [{ text: "", isCorrect: true }],
          };
        }

        return { ...question, answers: nextAnswers };
      }),
    );
  };

  const validateForm = () => {
    if (!title.trim()) throw new Error("يرجى ادخال عنوان الواجب");
    if (!subject.trim()) throw new Error("يرجى ادخال المادة");
    if (!endDate) throw new Error("يرجى اختيار تاريخ انتهاء الواجب");

    const cleanQuestions = questions
      .map((question) => ({
        name: question.name.trim(),
        answers: question.answers
          .map((answer) => ({ ...answer, text: answer.text.trim() }))
          .filter((answer) => answer.text),
      }))
      .filter((question) => question.name || question.answers.length > 0);

    if (!cleanQuestions.length)
      throw new Error("يرجى إضافة سؤال واحد على الأقل");

    for (const question of cleanQuestions) {
      if (!question.name) throw new Error("يرجى كتابة نص كل سؤال");
      if (question.answers.length < 2 || question.answers.length > 4) {
        throw new Error("كل سؤال يحتاج إلى ما بين 2 و 4 إجابات فقط");
      }
      if (!question.answers.some((answer) => answer.isCorrect)) {
        throw new Error("يرجى تحديد إجابة صحيحة واحدة على الأقل لكل سؤال");
      }
    }

    return {
      title: title.trim(),
      subject: subject.trim(),
      endDate: endDate.toISOString().split("T")[0],
      questions: cleanQuestions.map((question) => ({
        name: question.name,
        answers: question.answers.map(({ text, isCorrect }) => ({
          text,
          isCorrect,
        })),
      })),
    };
  };

  const onCreate = async () => {
    try {
      const payload = validateForm();
      await createMutation.mutateAsync(payload);
      Toast.show({
        type: "success",
        text1: "تم إنشاء الواجب بنجاح",
        text2: "تم حفظ الواجب",
      });
      router.back();
    } catch (e) {
      console.error("create assignment error", e);
      Toast.show({
        type: "error",
        text1: "تعذر إنشاء الواجب",
        text2: e?.message || "حدث خطأ غير متوقع أثناء إنشاء الواجب",
      });
    }
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: theme.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <InputField
          text="عنوان الواجب"
          value={title}
          onChangeText={setTitle}
          placeholder="مثال: واجب الأسبوع الأول"
          placeholderTextColor={theme.textSecondary}
        />

        <CustomDropdown
          dropdownLabel="المادة"
          data={assignmentSubjects}
          placeHolder="اختر المادة"
          value={subject}
          onChange={(item) => setSubject(item.value)}
        />

        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateFieldLabel}>تاريخ الانتهاء</Text>
          {Platform.OS === "web" ? (
            <input
              type="date"
              value={endDate ? dateUtils.dateOnly(endDate) : ""}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              style={{
                width: "100%",
                height: 50,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: theme.borderColor,
                backgroundColor: theme.secondary,
                color: theme.title,
                padding: 12,
                fontFamily: fonts.regular,
                textAlign: "right",
              }}
            />
          ) : (
            <>
              <Pressable
                style={[
                  styles.dateTimeSelector,
                  {
                    borderColor: theme.borderColor,
                    backgroundColor: theme.secondary,
                  },
                ]}
                onPress={() => setShowEndDate(true)}
              >
                <Text style={[styles.dateTimeText, { color: theme.title }]}>
                  {endDate
                    ? `${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()}`
                    : "اختر التاريخ"}
                </Text>
              </Pressable>
              {showEndDate && (
                <DateTimePicker
                  minimumDate={new Date()}
                  mode="date"
                  display="default"
                  value={endDate}
                  onChange={(event, selectedDate) => {
                    setShowEndDate(false);
                    if (selectedDate) setEndDate(selectedDate);
                  }}
                />
              )}
            </>
          )}
        </View>

        <View style={styles.questionsHeader}>
          <Text style={styles.heading}>الأسئلة</Text>
          <TouchableOpacity onPress={addQuestion} style={styles.addButton}>
            <Ionicons name="add-circle" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {questions.map((question, qIndex) => (
          <View key={`question-${qIndex}`} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>السؤال {qIndex + 1}</Text>
              {questions.length > 1 && (
                <TouchableOpacity onPress={() => removeQuestion(qIndex)}>
                  <MaterialCommunityIcons
                    name="delete"
                    size={24}
                    color="darkred"
                  />
                </TouchableOpacity>
              )}
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  borderColor: theme.borderColor,
                  backgroundColor: theme.secondary,
                  color: theme.title,
                },
              ]}
              value={question.name}
              onChangeText={(value) => updateQuestion(qIndex, "name", value)}
              placeholder="اكتب نص السؤال"
              placeholderTextColor={theme.textSecondary}
              multiline
            />

            <View style={styles.answersHeader}>
              <Text style={styles.answerLabel}>الإجابات</Text>
              <TouchableOpacity
                onPress={() => addAnswer(qIndex)}
                style={[
                  styles.secondaryButton,
                  question.answers.length >= 4 && {
                    opacity: 0.45,
                  },
                ]}
                disabled={question.answers.length >= 4}
              >
                <Text style={styles.secondaryButtonText}>+ إجابة</Text>
              </TouchableOpacity>
            </View>

            {question.answers.map((answer, aIndex) => (
              <View key={`answer-${qIndex}-${aIndex}`} style={styles.answerRow}>
                <TouchableOpacity
                  onPress={() => setCorrectAnswer(qIndex, aIndex)}
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
                  {answer.isCorrect ? <View style={styles.radioDot} /> : null}
                </TouchableOpacity>

                <TextInput
                  style={[
                    styles.answerInput,
                    {
                      borderColor: theme.borderColor,
                      backgroundColor: theme.secondary,
                      color: theme.title,
                    },
                  ]}
                  value={answer.text}
                  onChangeText={(value) =>
                    updateAnswer(qIndex, aIndex, "text", value)
                  }
                  placeholder={`إجابة ${aIndex + 1}`}
                  placeholderTextColor={theme.textSecondary}
                />

                {question.answers.length > 2 && (
                  <TouchableOpacity
                    onPress={() => removeAnswer(qIndex, aIndex)}
                  >
                    <Entypo name="cross" size={24} color="darkred" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        ))}
        <Button
          text="إنشاء الواجب"
          disabled={isSubmitting}
          loading={isSubmitting}
          style={styles.button}
          onPressEvent={onCreate}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    screen: { flex: 1 },
    content: { padding: 16 },
    sectionHeader: { marginBottom: 12 },
    heading: {
      fontFamily: fonts.bold,
      fontSize: 18,
      color: colors.title,
    },
    label: { fontFamily: fonts.medium, marginBottom: 6, textAlign: "right" },
    input: {
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
      borderColor: colors.borderColor,
      backgroundColor: colors.secondary,
      color: colors.title,
      fontFamily: fonts.regular,
    },
    dateTimeContainer: {
      width: "100%",
    },
    dateTimeSelector: {
      height: 50,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.inputField.borderColor,
      backgroundColor: colors.inputField.background,
    },
    dateTimeText: {
      fontSize: 16,
      fontFamily: fonts.medium,
      marginRight: 10,
      color: colors.inputField.color,
    },
    dateFieldLabel: {
      fontFamily: fonts.medium,
      fontSize: 14,
      marginVertical: 5,
      width: "100%",
      color: colors.dropdown.label,
    },
    questionsHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 18,
      marginBottom: 10,
    },
    addButton: {
      padding: 12,
    },
    questionCard: {
      backgroundColor: colors.secondary,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.borderColor,
      padding: 12,
      marginBottom: 14,
    },
    questionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    questionNumber: {
      fontFamily: fonts.bold,
      color: colors.title,
      fontSize: 14,
    },

    answersHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    answerLabel: {
      fontFamily: fonts.bold,
      color: colors.title,
      fontSize: 12,
    },
    secondaryButton: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.borderColor,
      paddingHorizontal: 8,
      paddingVertical: 6,
    },
    secondaryButtonText: {
      fontFamily: fonts.bold,
      color: colors.title,
      fontSize: 11,
    },
    answerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    radioDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#fff",
    },
    answerInput: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      color: colors.title,
      backgroundColor: colors.background,
      fontFamily: fonts.regular,
      textAlign: "right",
    },
    actionsRow: {
      gap: 10,
      marginTop: 10,
    },
    primaryButton: {
      borderRadius: 10,
      padding: 14,
      alignItems: "center",
    },
    primaryButtonText: {
      fontFamily: fonts.bold,
      color: "#fff",
      fontSize: 14,
    },
    secondaryActionButton: {
      borderRadius: 10,
      padding: 14,
      borderWidth: 1,
      alignItems: "center",
    },
    secondaryActionButtonText: {
      fontFamily: fonts.bold,
      fontSize: 14,
    },
    button: {
      backgroundColor: colors.register.button,
    },
  });
}
