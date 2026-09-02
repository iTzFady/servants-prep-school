import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fonts } from "@/theme/fonts";
import { useAssignments } from "@/hooks/useAssignment";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorIndicator from "@/components/ErrorIndicator";
import { ThemeContext } from "@/context/ThemeContext";
import { router } from "expo-router";

export default function AdminAssignmentsIndex() {
  const { data, isLoading, error, refetch } = useAssignments();
  const { theme } = useContext(ThemeContext);
  const assignments = data || [];

  const styles = React.useMemo(() => createStyles(theme), [theme]);

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
            إدارة الواجبات
          </Text>
          <TouchableOpacity
            style={[
              styles.createButton,
              { backgroundColor: theme.admin?.button || theme.primary },
            ]}
            onPress={() => router.push("/admin/assignments/create")}
          >
            <Text style={styles.createText}>إنشاء واجب جديد</Text>
          </TouchableOpacity>
        </View>

        {assignments.map((a) => (
          <TouchableOpacity
            key={a.id}
            style={[
              styles.card,
              {
                backgroundColor: theme.secondary,
                borderColor: theme.borderColor,
              },
            ]}
            onPress={() => router.push(`/admin/assignments/${a.id}`)}
          >
            <Text style={[styles.cardTitle, { color: theme.title }]}>
              {a.title}
            </Text>
            <Text style={[styles.cardMeta, { color: theme.textSecondary }]}>
              {a.subject} • {a.questions ?? "-"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    screen: { flex: 1 },
    content: { padding: 16, paddingBottom: 40 },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    title: { fontFamily: fonts.bold, fontSize: 18, color: colors.title },
    createButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    createText: { fontFamily: fonts.bold, color: "#fff" },
    card: {
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      marginBottom: 10,
      borderColor: colors.borderColor,
      backgroundColor: colors.secondary,
    },
    cardTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.title },
    cardMeta: {
      fontFamily: fonts.regular,
      fontSize: 12,
      marginTop: 6,
      color: colors.textSecondary,
    },
  });
}
