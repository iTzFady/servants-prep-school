import { useContext, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import InputField from "@/components/InputField";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { useResultsStorage } from "@/hooks/useResults";
import Button from "@/components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function AdminStudentResults() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const router = useRouter();
  const { id, name } = useLocalSearchParams();
  const { subjects, isLoading, getResultsForStudent, saveResultsForStudent } =
    useResultsStorage();

  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const existing = getResultsForStudent(id);
    setValues(
      subjects.reduce((acc, subject) => {
        acc[subject] = existing[subject] ?? "";
        return acc;
      }, {}),
    );
  }, [getResultsForStudent, id, subjects]);

  const handleChange = (subject, text) => {
    setValues((prev) => ({ ...prev, [subject]: text }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveResultsForStudent(id, values);
      Toast.show({
        type: "success",
        text1: "تم حفظ النتائج",
        text2: "تم تحديث نتائج الطالب بنجاح.",
      });
      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "فشل الحفظ",
        text2: error?.message || "حدث خطأ أثناء حفظ النتائج.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <LoadingIndicator />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>نتائج الطالب</Text>
      <Text style={styles.subtitle}>{name || "المخدوم"}</Text>

      {subjects.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyText}>
            لا توجد مواد مضافة بعد. اذهب الى صفحة ادارة النتائج واضف المواد.
          </Text>
        </View>
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.subjectLabel}>{item}</Text>
              <InputField
                text="الدرجة"
                value={values[item]}
                onChangeText={(text) => handleChange(item, text)}
                placeholder="مثال: 85"
                keyboardType="numeric"
              />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Button
        text="حفظ النتائج"
        onPressEvent={handleSave}
        style={styles.saveButton}
        loading={saving}
        disabled={subjects.length === 0}
      />
    </SafeAreaView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.background,
    },
    title: {
      color: theme.section.color,
      fontFamily: fonts.bold,
      fontSize: 22,
      marginBottom: 4,
    },
    subtitle: {
      color: theme.textSecondary,
      fontFamily: fonts.regular,
      fontSize: 14,
      marginBottom: 16,
    },
    card: {
      padding: 18,
      borderRadius: 20,
      backgroundColor: theme.secondary,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 16,
      elevation: 3,
    },
    subjectLabel: {
      color: theme.section.color,
      fontFamily: fonts.bold,
      fontSize: 16,
      marginBottom: 12,
    },
    separator: {
      height: 12,
    },
    listContent: {
      gap: 16,
      paddingBottom: 24,
    },
    saveButton: {
      backgroundColor: theme.admin.button,
      color: "white",
      borderRadius: 14,
      height: 52,
    },
    emptyWrapper: {
      paddingVertical: 40,
      alignItems: "center",
    },
    emptyText: {
      color: theme.textSecondary,
      fontFamily: fonts.regular,
      textAlign: "center",
    },
  });
}
