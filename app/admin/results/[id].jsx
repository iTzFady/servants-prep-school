import { useContext, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import InputField from "@/components/InputField";
import { useLocalSearchParams } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { useResultsStorage } from "@/hooks/useResults";
import { SubjectTabs, getSubjectLabel } from "@/data/subjects";
import Button from "@/components/Button";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function AdminStudentResults() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const { id, name } = useLocalSearchParams();
  const { subjects, isLoading, getResultsForStudent, saveResultsForStudent } =
    useResultsStorage();

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [newScore, setNewScore] = useState("");
  const [adding, setAdding] = useState(false);
  const insets = useSafeAreaInsets();
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);

  const savedValues = getResultsForStudent(id);
  // fallback to canonical subjects from data/subjects.js when none are stored
  const effectiveSubjects =
    subjects && subjects.length > 0
      ? subjects
      : SubjectTabs.map((t) => t.value);

  const displayedValues = effectiveSubjects.reduce((acc, subject) => {
    acc[subject] = values[subject] ?? savedValues[subject] ?? "";
    return acc;
  }, {});

  const remainingSubjectsToAdd = effectiveSubjects.filter(
    (s) =>
      (savedValues[s] === undefined || savedValues[s] === "") &&
      (values[s] === undefined || values[s] === ""),
  );

  const handleChange = (subject, text) => {
    setValues((prev) => ({ ...prev, [subject]: text }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveResultsForStudent(id, displayedValues);
      Toast.show({
        type: "success",
        text1: "تم حفظ النتائج",
        text2: "تم تحديث نتائج الطالب بنجاح.",
      });
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
          data={effectiveSubjects}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconWrapper}>
                  {(() => {
                    const tab = SubjectTabs.find((t) => t.value === item);
                    const IconComp = tab?.icon;
                    return IconComp
                      ? IconComp({ color: theme.section.color, size: 20 })
                      : null;
                  })()}
                </View>
                <Text style={styles.subjectLabel}>
                  {getSubjectLabel(item) || item}
                </Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBackground}>
                    {(() => {
                      const raw = Number(displayedValues[item] ?? 0);
                      const pct = Math.max(
                        0,
                        Math.min(100, Number.isFinite(raw) ? raw : 0),
                      );
                      return (
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${pct}%`,
                              backgroundColor: theme.admin.button,
                            },
                          ]}
                        />
                      );
                    })()}
                  </View>
                  <Text style={styles.progressText}>
                    {displayedValues[item] ?? ""}
                  </Text>
                </View>
              </View>
              <InputField
                text="الدرجة"
                value={displayedValues[item]}
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

      {remainingSubjectsToAdd.length > 0 && !isAddModalVisible && (
        <TouchableOpacity
          accessibilityLabel="اضافة نتيجة"
          activeOpacity={0.9}
          onPress={() => setAddModalVisible(true)}
          style={[styles.addButtonFloating, { bottom: insets.bottom + 20 }]}
        >
          <Text style={styles.addButtonFloatingText}>+</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={isAddModalVisible}
        transparent
        statusBarTranslucent
        navigationBarTranslucent
        animationType="fade"
      >
        <View style={[styles.modalContainer, { paddingBottom: insets.bottom }]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setAddModalVisible(false)}
          />
          <View
            style={styles.overlayModal}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.modalTitle}>اختر المادة</Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.modalList}
            >
              {remainingSubjectsToAdd.map((s) => {
                const tab = SubjectTabs.find((t) => t.value === s);
                return (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.modalItem,
                      selectedSubject === s && {
                        borderColor: theme.section.color,
                      },
                    ]}
                    onPress={() => setSelectedSubject(s)}
                  >
                    <View style={styles.modalItemLeft}>
                      {tab?.icon?.({ color: theme.section.color, size: 20 })}
                      <Text style={styles.modalItemText}>
                        {getSubjectLabel(s) || s}
                      </Text>
                    </View>
                    {selectedSubject === s && (
                      <Text style={styles.selectedMark}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <InputField
              text="الدرجة"
              value={newScore}
              onChangeText={setNewScore}
              placeholder="مثال: 85"
              keyboardType="numeric"
            />
            <Button
              text="حفظ النتائج"
              onPressEvent={handleSave}
              style={styles.saveButton}
              loading={saving}
              disabled={effectiveSubjects.length === 0}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
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
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    iconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.section.background,
      alignItems: "center",
      justifyContent: "center",
    },
    progressContainer: {
      flex: 1,
      alignItems: "flex-end",
    },
    progressBarBackground: {
      width: "100%",
      height: 8,
      borderRadius: 8,
      backgroundColor: theme.section.background,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
    },
    progressText: {
      color: theme.textSecondary,
      fontFamily: fonts.regular,
      fontSize: 12,
      marginTop: 6,
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
    addButton: {
      marginTop: 12,
      backgroundColor: theme.admin.button,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
    },
    addButtonText: {
      color: "white",
      fontFamily: fonts.bold,
      fontSize: 16,
    },
    addButtonFloating: {
      position: "absolute",
      right: 20,
      bottom: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.admin.button,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 12,
      zIndex: 9999,
    },
    addButtonFloatingText: {
      color: "white",
      fontSize: 28,
      lineHeight: 28,
      fontFamily: fonts.bold,
    },
    modalContainer: {
      ...StyleSheet.absoluteFill,
      backgroundColor: "rgba(0,0,0,.5)",
      justifyContent: "flex-end",
    },
    overlayModal: {
      backgroundColor: theme.settings.section.background,
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      gap: 12,
    },
    modalTitle: {
      fontSize: 22,
      fontFamily: fonts.regular,
      color: theme.section.color,
    },
    modalList: {
      maxHeight: 240,
      marginBottom: 12,
    },
    modalItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "transparent",
      marginBottom: 8,
      backgroundColor: theme.secondary,
    },
    modalItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    modalItemText: {
      fontFamily: fonts.regular,
      color: theme.section.color,
    },
    selectedMark: {
      color: theme.section.color,
      fontFamily: fonts.bold,
    },
  });
}
