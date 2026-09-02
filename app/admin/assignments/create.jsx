import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fonts } from "@/theme/fonts";
import {
  useAdminCreateAssignment,
  useAdminNotifyAssignment,
} from "@/hooks/useAssignment";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorIndicator from "@/components/ErrorIndicator";
import { ThemeContext } from "@/context/ThemeContext";
import { router } from "expo-router";

export default function CreateAssignment() {
  const { theme } = useContext(ThemeContext);
  const createMutation = useAdminCreateAssignment();
  const notifyMutation = useAdminNotifyAssignment();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [instructions, setInstructions] = useState("");

  const onCreate = async () => {
    try {
      const payload = { title, subject, instructions };
      const res = await createMutation.mutateAsync(payload);
      // option to notify
      await notifyMutation.mutateAsync({
        assignmentTitle: title,
        assignmentId: res?.id || "",
      });
      router.back();
    } catch (e) {
      console.error("create assignment error", e);
    }
  };
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: theme.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color: theme.title }]}>عنوان الواجب</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.borderColor,
              backgroundColor: theme.secondary,
              color: theme.title,
            },
          ]}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[styles.label, { color: theme.title }]}>المادة</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.borderColor,
              backgroundColor: theme.secondary,
              color: theme.title,
            },
          ]}
          value={subject}
          onChangeText={setSubject}
        />

        <Text style={[styles.label, { color: theme.title }]}>تعليمات</Text>
        <TextInput
          style={[
            styles.input,
            {
              height: 120,
              textAlignVertical: "top",
              borderColor: theme.borderColor,
              backgroundColor: theme.secondary,
              color: theme.title,
            },
          ]}
          value={instructions}
          onChangeText={setInstructions}
          multiline
        />

        <TouchableOpacity
          style={[styles.save, { backgroundColor: theme.primary }]}
          onPress={onCreate}
        >
          <Text style={styles.saveText}>إنشاء و إشعار</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
function createStyles(colors) {
  return StyleSheet.create({
    screen: { flex: 1 },
    content: { padding: 16, paddingBottom: 40 },
    label: { fontFamily: fonts.medium, marginBottom: 6, color: colors.title },
    input: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      marginBottom: 12,
      borderColor: colors.borderColor,
      backgroundColor: colors.secondary,
      color: colors.title,
    },
    save: { padding: 12, borderRadius: 8, alignItems: "center", marginTop: 8 },
    saveText: { fontFamily: fonts.bold, color: "#fff" },
  });
}
