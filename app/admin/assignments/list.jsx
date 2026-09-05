import React, { useContext, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  useAssignments,
  useAdminNotifyAssignment,
} from "@/hooks/useAssignment";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorIndicator from "@/components/ErrorIndicator";
import { getSubjectLabel } from "@/data/subjects";

export default function AdminAssignmentsList() {
  const { data, isLoading, error, refetch } = useAssignments();
  const notifyMutation = useAdminNotifyAssignment();
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const assignments = data || [];

  const openAssignment = (assignment) => {
    router.push(`/admin/assignments/${assignment.id}`);
  };

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
      <View style={styles.container}>
        <Text
          style={[
            styles.headerText,
            { color: theme.section?.color || theme.primary },
          ]}
        >
          {"اختر واجب لعرض الأسئلة"}
        </Text>

        <FlatList
          data={assignments}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => openAssignment(item)}
              style={[
                styles.assignmentCard,
                {
                  backgroundColor: theme.secondary,
                  borderColor: theme.borderColor,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.assignmentTitle, { color: theme.title }]}>
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.assignmentSubject,
                    { color: theme.textSecondary },
                  ]}
                >
                  {getSubjectLabel(item.subject)}
                </Text>
              </View>

              <Text
                style={[styles.assignmentMeta, { color: theme.textSecondary }]}
              >
                {item.endDate
                  ? `ينتهي: ${new Date(item.endDate).toLocaleDateString("ar-EG")}`
                  : "لا يوجد تاريخ انتهاء"}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    screen: { flex: 1 },
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 14,
    },
    headerText: {
      fontFamily: fonts.bold,
      fontSize: 18,
      marginBottom: 14,
    },
    listContent: {
      paddingBottom: 28,
    },
    assignmentCard: {
      borderWidth: 1,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
    },
    cardHeader: {
      marginBottom: 5,
    },
    assignmentTitle: {
      fontFamily: fonts.bold,
      fontSize: 17,
      flex: 1,
    },
    assignmentSubject: {
      fontFamily: fonts.regular,
      fontSize: 12,
      marginLeft: 8,
    },
    assignmentMeta: {
      fontFamily: fonts.regular,
      fontSize: 12,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalCard: {
      width: "100%",
      maxWidth: 360,
      borderWidth: 1,
      borderRadius: 18,
      padding: 18,
    },
    modalTitle: {
      fontFamily: fonts.bold,
      fontSize: 20,
      marginBottom: 8,
      textAlign: "center",
    },
    modalText: {
      fontFamily: fonts.regular,
      fontSize: 14,
      lineHeight: 22,
      textAlign: "center",
      marginBottom: 18,
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
    },
    cancelText: {
      fontFamily: fonts.bold,
      fontSize: 14,
    },
    confirmButton: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
    },
    confirmText: {
      color: "#fff",
      fontFamily: fonts.bold,
      fontSize: 14,
    },
  });
}
