import { View, TextInput, StyleSheet, Text, FlatList } from "react-native";
import * as Sentry from "@sentry/react-native";
import { Feather } from "@expo/vector-icons";
import { useState, useContext, useMemo, useCallback } from "react";
import { fonts } from "@/theme/fonts";
import { ThemeContext } from "@/context/ThemeContext";
import { useUsersList } from "@/hooks/useUser";
import { useRouter } from "expo-router";
import StudentCard from "@/components/StudentCard";
import ErrorIndicator from "@/components/ErrorIndicator";
import LoadingIndicator from "@/components/LoadingIndicator";
import { SafeAreaView } from "react-native-safe-area-context";
export default function NoteStudentList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { data: users, isLoading, error, refetch } = useUsersList(false);

  const filteredUsers = useMemo(
    () =>
      users?.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ) || [],
    [searchQuery, users],
  );
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const renderUser = useCallback(
    ({ item }) => {
      return (
        <StudentCard
          item={item}
          onPress={() =>
            router.push({
              pathname: `/admin/spiritual-note/${item.id}`,
              params: { name: item.name },
            })
          }
        />
      );
    },
    [router],
  );

  if (isLoading) return <LoadingIndicator />;
  if (error) {
    return (
      <ErrorIndicator state="error" text={error.message} onRetry={onRefresh} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={theme.inputField.color} />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن مستخدم..."
          placeholderTextColor={theme.inputField.color}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>الطلاب الحاليين</Text>
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<ErrorIndicator text="لا يوجد مستخدمين" />}
      />
    </SafeAreaView>
  );
}
function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: theme.inputField.background,
      borderRadius: 14,
      marginBottom: 16,
      gap: 10,
    },
    searchInput: {
      flex: 1,
      fontFamily: fonts.regular,
      fontSize: 14,
      color: theme.inputField.color,
      padding: 0,
    },
    listContent: {
      paddingBottom: 16,
      gap: 12,
      flexGrow: 1,
    },
    sectionHeader: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },

    sectionHeaderText: {
      fontFamily: fonts.bold,
      fontSize: 14,
      color: theme.title,
    },
  });
}
