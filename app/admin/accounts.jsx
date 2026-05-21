import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useState, useContext, useMemo, useCallback } from "react";
import { fonts } from "@/theme/fonts";
import { ThemeContext } from "@/context/ThemeContext";
import { usePendingUsers } from "@/hooks/useApi";
import { useRouter } from "expo-router";

export default function AccountsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const router = useRouter();
  const { data: users, isLoading, isError } = usePendingUsers();
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
        <Pressable
          style={styles.userCard}
          onPress={() => router.push(`/admin/accounts/${item.id}`)}
        >
          <View style={styles.userInfo}>
            <View style={styles.avatar}>{item.name.charAt(0)}</View>
            <View style={styles.userText}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userId}>{item.id}</Text>
            </View>
          </View>
          <MaterialIcons
            name="keyboard-arrow-left"
            size={24}
            color={theme.section.color}
          />
        </Pressable>
      );
    },
    [router, styles, theme.section.color],
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
        <Text style={styles.sectionHeaderText}>طلبات قد الانتظار</Text>
      </View>
      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.section.color} />
        </View>
      ) : isError ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>حدث خطأ أثناء تحميل الطلبات.</Text>
        </View>
      ) : filteredUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>لا يوجد مستخدمين قيد الانتظار.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
    },
    userCard: {
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.card.background,
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.borderColor,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 16,
      elevation: 2,
    },
    userInfo: {
      flexDirection: "row-reverse",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 14,
      backgroundColor: theme.section.color,
      justifyContent: "center",
      alignItems: "center",
    },
    userText: {
      flex: 1,
    },
    userName: {
      fontFamily: fonts.bold,
      fontSize: 16,
      color: theme.title,
      textAlign: "right",
    },
    userId: {
      fontFamily: fonts.regular,
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
      textAlign: "right",
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
      textAlign: "center",
      paddingHorizontal: 20,
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
