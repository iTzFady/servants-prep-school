import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useState, useContext, useMemo, useCallback } from "react";
import { fonts } from "@/theme/fonts";
import { ThemeContext } from "@/context/ThemeContext";
import { useUsersList } from "@/hooks/useApi";
import { useRouter } from "expo-router";
import StudentCard from "@/components/StudentCard";
export default function AttendanceStudentList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const router = useRouter();
  const { data: users, isLoading, isError } = useUsersList(false);
  const filteredUsers = useMemo(
    () =>
      users?.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ) || [],
    [searchQuery, users],
  );

  const renderUser = useCallback(
    ({ item }) => {
      return (
        <StudentCard
          item={item}
          onPress={() =>
            router.push({
              pathname: `/admin/attendance/${item.id}`,
              params: { name: item.name },
            })
          }
        />
      );
    },
    [router],
  );

  return (
    <View style={styles.container}>
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
      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.section.color} />
        </View>
      ) : isError ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>حدث خطأ أثناء تحميل الطلبات.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={[styles.container, styles.centerContent, { flex: 1 }]}>
              <AntDesign name="dropbox" size={34} color={theme.section.color} />
              <Text style={styles.errorText}>لا يوجد مخدومين.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.background,
    },
    centerContent: {
      justifyContent: "center",
      alignItems: "center",
    },
    pageTitle: {
      fontFamily: fonts.bold,
      fontSize: 22,
      color: theme.title,
      textAlign: "right",
      marginBottom: 16,
    },
    searchContainer: {
      flexDirection: "row-reverse",
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
      textAlign: "right",
      padding: 0,
    },
    listContent: {
      paddingBottom: 16,
      gap: 12,
      flexGrow: 1,
    },

    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 40,
    },
    emptyText: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
    },
    errorText: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: theme.section.color,
      marginTop: 12,
      textAlign: "center",
    },
    sectionHeader: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },

    sectionHeaderText: {
      fontFamily: fonts.bold,
      fontSize: 14,
      color: theme.title,
      textAlign: "right",
    },
  });
}
