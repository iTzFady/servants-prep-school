import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import * as Sentry from "@sentry/react-native";

import { Feather, Entypo } from "@expo/vector-icons";
import { useState, useContext, useMemo, useCallback } from "react";
import { fonts } from "@/theme/fonts";
import { ThemeContext } from "@/context/ThemeContext";
import { useMarkAttendance, useBulkAttendance } from "@/hooks/useAttendance";
import { useUsersList } from "@/hooks/useUser";
import { useRouter } from "expo-router";
import StudentCard from "@/components/StudentCard";
import Toast from "react-native-toast-message";
import Button from "@/components/Button";
import ErrorIndicator from "@/components/ErrorIndicator";
import LoadingIndicator from "@/components/LoadingIndicator";
import { SafeAreaView } from "react-native-safe-area-context";
export default function AttendanceManual() {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [locked, setLocked] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const attendance = useMarkAttendance();
  const { data: users, isLoading, error, refetch } = useUsersList(true);
  const bulkAttendance = useBulkAttendance();

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

  async function finishDay() {
    try {
      if (!users?.length) {
        Toast.show({
          type: "info",
          text1: "لا يوجد طلاب",
          text2: "لا يوجد طلاب لإنهاء الغياب",
        });

        return;
      }

      await bulkAttendance.mutateAsync({
        userIds: users.map((user) => user.id),
      });

      Toast.show({
        type: "success",
        text1: "تم انهاء اليوم",
        text2: "تم تسجيل الغياب للطلاب المتبقين",
      });

      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "فشل انهاء اليوم",
        text2: error?.message || "حدث خطأ غير متوقع",
      });
    }
  }

  function resetState() {
    setModalVisible(false);
    setStudentId("");
    setStatus("");
    setNote("");
    setLocked(false);
  }

  async function submit(selectedStatus = status) {
    try {
      await attendance.mutateAsync({
        id: studentId,
        status: selectedStatus,
        note: selectedStatus === "PRESENT" ? "" : note,
      });

      Toast.show({
        type: "success",
        text1: "تم تسجيل الحضور",
        text2: "تم حفظ حالة الطالب بنجاح",
      });

      resetState();

      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "فشل تسجيل الحضور",
        text2: error.message || "حدث خطأ غير متوقع",
      });

      resetState();

      router.back();
    }
  }

  const renderUser = useCallback(({ item }) => {
    return (
      <StudentCard
        item={item}
        onPress={() => {
          setLocked(true);
          setStudentId(item.id);
          setModalVisible(true);
        }}
      />
    );
  }, []);

  if (isLoading) return <LoadingIndicator />;
  if (error)
    return (
      <ErrorIndicator state="error" text={error.message} onRetry={onRefresh} />
    );

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
      <Button
        text="انهاء غياب اليوم"
        onPressEvent={() =>
          Alert.alert(
            "هل انت متأكد من هذا الامر؟",
            "هل انت متأكد من انهاء اليوم؟ لا يمكن الغاء هذا الامر",
            [
              { text: "الغاء", style: "cancel" },
              {
                text: bulkAttendance.isPending ? "جاري التنفيذ" : "تأكيد",
                style: "destructive",
                onPress: finishDay,
              },
            ],
          )
        }
        prefixIcon={<Entypo name="cross" size={24} color="#ffffff" />}
        style={styles.endButton}
      />
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
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlayModal}>
          <View style={styles.card}>
            <Text style={styles.titleModal}>
              برجاء الاختيار حالة حضور الطالب
            </Text>

            <TouchableOpacity
              disabled={attendance.isPending}
              style={[styles.button, attendance.isPending && styles.disabled]}
              onPress={() => submit("PRESENT")}
            >
              <Text style={styles.buttonText}>حاضر</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={attendance.isPending}
              style={[styles.button, attendance.isPending && styles.disabled]}
              onPress={() => setStatus("EXCUSEDLATE")}
            >
              <Text style={styles.buttonText}>تأخير بعذر مقبول</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={attendance.isPending}
              style={[styles.button, attendance.isPending && styles.disabled]}
              onPress={() => setStatus("UNEXCUSEDLATE")}
            >
              <Text style={styles.buttonText}>تأخير بعذر غير مقبول</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={attendance.isPending}
              style={[styles.button, attendance.isPending && styles.disabled]}
              onPress={() => submit("ABSENT")}
            >
              <Text style={styles.buttonText}>غائب</Text>
            </TouchableOpacity>

            {(status === "EXCUSEDLATE" || status === "UNEXCUSEDLATE") && (
              <>
                <TextInput
                  placeholder="ملاحظة"
                  value={note}
                  editable={!attendance.isPending}
                  onChangeText={setNote}
                  style={styles.input}
                />

                <TouchableOpacity
                  disabled={attendance.isPending}
                  style={[
                    styles.submit,
                    attendance.isPending && styles.disabled,
                  ]}
                  onPress={() => submit()}
                >
                  {attendance.isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={{ color: "white", fontFamily: fonts.medium }}>
                      ارسال
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}
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
    overlayModal: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,.5)",
      justifyContent: "flex-end",
    },

    card: {
      backgroundColor: "white",
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      gap: 12,
    },

    titleModal: {
      fontSize: 22,
      fontFamily: fonts.regular,
    },

    button: {
      backgroundColor: "#EEE",
      padding: 16,
      borderRadius: 12,
    },

    input: {
      borderWidth: 1,
      borderColor: "#DDD",
      borderRadius: 12,
      padding: 12,
      textAlign: "right",
      fontFamily: fonts.light,
    },
    buttonText: {
      fontFamily: fonts.medium,
      textAlign: "right",
    },

    submit: {
      backgroundColor: "#2E248D",
      padding: 14,
      borderRadius: 12,
      alignItems: "center",
    },
    endButton: {
      backgroundColor: theme.admin.button,
    },
  });
}
