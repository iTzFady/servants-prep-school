import { useCallback, useContext, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useResultsStorage } from "@/hooks/useResults";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function AddResultSubject() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const router = useRouter();
  const { addSubject, subjects, isLoading } = useResultsStorage();
  const [subjectName, setSubjectName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    const trimmed = subjectName.trim();
    if (!trimmed) {
      Toast.show({
        type: "info",
        text1: "ادخل اسم المادة",
        text2: "يجب كتابة اسم المادة قبل الحفظ.",
      });
      return;
    }
    if (subjects.includes(trimmed)) {
      Toast.show({
        type: "info",
        text1: "المادة موجودة بالفعل",
        text2: "من فضلك اختر اسم مادة جديد.",
      });
      return;
    }
    setSaving(true);
    try {
      await addSubject(trimmed);
      Toast.show({
        type: "success",
        text1: "تم اضافة المادة",
      });
      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "فشل حفظ المادة",
        text2: error?.message || "حدث خطأ أثناء حفظ المادة.",
      });
    } finally {
      setSaving(false);
    }
  }, [subjectName, subjects, addSubject, router]);

  if (isLoading) return <LoadingIndicator />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>اضافة مادة جديدة</Text>
          <Text style={styles.subtitle}>اكتب اسم المادة ثم اضغط حفظ.</Text>
          <InputField
            text="اسم المادة"
            value={subjectName}
            onChangeText={setSubjectName}
            placeholder="مثال: كتاب مقدس"
          />
          <Button
            text="حفظ المادة"
            onPressEvent={handleSave}
            style={styles.saveButton}
            loading={saving}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      padding: 16,
    },
    card: {
      padding: 20,
      borderRadius: 24,
      backgroundColor: theme.secondary,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 16,
      elevation: 3,
    },
    title: {
      color: theme.section.color,
      fontFamily: fonts.bold,
      fontSize: 22,
      marginBottom: 8,
    },
    subtitle: {
      color: theme.textSecondary,
      fontFamily: fonts.regular,
      fontSize: 14,
      marginBottom: 18,
      lineHeight: 22,
    },
    saveButton: {
      backgroundColor: theme.admin.button,
      color: "white",
      borderRadius: 14,
      height: 52,
    },
  });
}
