import { useCallback, useContext, useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUsersList } from "@/hooks/useUser";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import StudentCard from "@/components/StudentCard";
import ErrorIndicator from "@/components/ErrorIndicator";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useResultsStorage } from "@/hooks/useResults";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function AdminResultsPage() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const router = useRouter();
  const { data: users, isLoading, error, refetch } = useUsersList(false);
  const {
    subjects,
    removeSubject,
    isLoading: isResultsLoading,
  } = useResultsStorage();
  const [refreshing, setRefreshing] = useState(false);

  const filteredUsers = useMemo(
    () => users?.sort((a, b) => a.name.localeCompare(b.name)) || [],
    [users],
  );

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const renderUser = useCallback(
    ({ item }) => (
      <StudentCard
        item={item}
        onPress={() =>
          router.push({
            pathname: `/admin/results/${item.id}`,
            params: { name: item.name },
          })
        }
      />
    ),
    [router],
  );

  if (isLoading || isResultsLoading) return <LoadingIndicator />;
  if (error)
    return (
      <ErrorIndicator
        state="error"
        text={error.message}
        onRetry={handleRefresh}
      />
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.headerTitle}>ادارة النتائج</Text>
        <Text style={styles.subtitle}>
          اضف المواد ثم اضغط على طالب لإدخال نتائج كل مادة.
        </Text>
        <Button
          text="اضافة مادة جديدة"
          onPressEvent={() => router.push("/admin/results/add")}
          style={styles.addButton}
        />
      </View>

      <Text style={styles.sectionTitle}>المواد المضافة</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subjectScroller}
      >
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <View key={subject} style={styles.subjectTag}>
              <Text style={styles.subjectText}>{subject}</Text>
              <TouchableOpacity onPress={() => removeSubject(subject)}>
                <MaterialIcons
                  name="close"
                  size={18}
                  color={theme.textPrimary}
                />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>لا توجد مواد مضافة حتى الآن.</Text>
        )}
      </ScrollView>

      <View style={styles.studentsHeader}>
        <Text style={styles.sectionTitle}>الطلاب</Text>
        <Text style={styles.sectionSubtitle}>
          اضغط على طالب لإدخال النتائج.
        </Text>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<ErrorIndicator text="لا يوجد طلاب لعرضهم." />}
      />
    </SafeAreaView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    heroCard: {
      padding: 20,
      borderRadius: 20,
      backgroundColor: theme.secondary,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 16,
      elevation: 3,
      marginBottom: 18,
    },
    headerTitle: {
      color: theme.section.color,
      fontSize: 22,
      fontFamily: fonts.bold,
      marginBottom: 8,
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: 14,
      fontFamily: fonts.regular,
      marginBottom: 18,
      lineHeight: 22,
    },
    addButton: {
      backgroundColor: theme.admin.button,
      color: "white",
      borderRadius: 14,
      width: "100%",
      height: 52,
    },
    sectionTitle: {
      fontFamily: fonts.bold,
      fontSize: 18,
      color: theme.section.color,
      marginBottom: 12,
    },
    sectionSubtitle: {
      color: theme.textSecondary,
      fontFamily: fonts.regular,
      fontSize: 13,
      marginBottom: 12,
    },
    subjectScroller: {
      paddingBottom: 16,
      gap: 12,
    },
    subjectTag: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 16,
      backgroundColor: theme.card.background,
      gap: 8,
      marginRight: 10,
      borderWidth: 1,
      borderColor: theme.borderColor,
    },
    subjectText: {
      color: theme.textPrimary,
      fontFamily: fonts.medium,
      fontSize: 14,
    },
    emptyText: {
      color: theme.textSecondary,
      fontFamily: fonts.regular,
      marginVertical: 16,
    },
    studentsHeader: {
      marginTop: 10,
      marginBottom: 8,
    },
    listContent: {
      gap: 14,
      paddingBottom: 20,
    },
  });
}
