import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  Alert,
} from "react-native";
import * as Sentry from "@sentry/react-native";
import { Feather } from "@expo/vector-icons";
import { useState, useContext, useMemo, useCallback } from "react";
import { fonts } from "@/theme/fonts";
import { ThemeContext } from "@/context/ThemeContext";
import { useUsersList } from "@/hooks/useUser";
import { router } from "expo-router";
import StudentCard from "@/components/StudentCard";
import ErrorIndicator from "@/components/ErrorIndicator";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useMarkConfession } from "@/hooks/useSpiritualNote";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
export default function AttendanceManual() {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const [refreshing, setRefreshing] = useState(false);
  const { data: users, isLoading, error, refetch } = useUsersList(false);
  const confession = useMarkConfession();
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
            Alert.alert(
              "تسجيل الاعتراف",
              `هل انت متأكد من تسجيل اعتراف المخدوم ${item.name}`,
              [
                { text: "الغاء", style: "cancel" },
                { text: "تسجيل", onPress: () => submit(item.id) },
              ],
            )
          }
        />
      );
    },
    [submit],
  );

  const submit = useCallback(
    async (id) => {
      try {
        await confession.mutateAsync({
          userId: id,
        });

        Toast.show({
          type: "success",
          text1: "تم تسجيل الاعتراف",
          text2: "تم حفظ الاعتراف بنجاح",
        });
        router.back();
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "فشل تسجيل الاعتراف",
          text2: error.message || "حدث خطأ غير متوقع",
        });
      }
    },
    [confession],
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
