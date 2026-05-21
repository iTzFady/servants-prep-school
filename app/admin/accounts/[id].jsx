import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useMemo, useContext } from "react";
import { useLocalSearchParams } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { useUserDetail, useUpdateUserStatus } from "@/hooks/useApi";
import Button from "@/components/Button";
import Toast from "react-native-toast-message";

function DetailRow({ label, value, styles }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || "-"}</Text>
    </View>
  );
}

export default function PendingUserDetail() {
  const { id } = useLocalSearchParams();
  const userId = Array.isArray(id) ? id[0] : id;
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);

  const { data: user, isLoading, isError } = useUserDetail(userId || "");

  const { mutate: updateStatus, isPending } = useUpdateUserStatus(userId || "");

  const handleStatusChange = (status) => {
    updateStatus(
      { status },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "تم تحديث الحالة",
            text2: `تم تغيير الحالة إلى ${status}`,
          });
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: "فشل تحديث الحالة",
            text2: error.message || "حاول مرة أخرى",
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.section.color} />
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          حدث خطأ أثناء تحميل بيانات المستخدم.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.subtitle}>{user.role || ""}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{user.status || "غير معروف"}</Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>معلومات الحساب</Text>
        <DetailRow label="اسم المستخدم" value={user.userName} styles={styles} />
        <DetailRow label="الاسم" value={user.name} styles={styles} />
        <DetailRow label="الجنس" value={user.gender} styles={styles} />
        <DetailRow
          label="تاريخ الميلاد"
          value={new Date(user.birthdate).toLocaleDateString()}
          styles={styles}
        />
        <DetailRow label="العنوان" value={user.address} styles={styles} />
        <DetailRow
          label="رقم الهاتف"
          value={user.phoneNumber}
          styles={styles}
        />
        <DetailRow label="الواتساب" value={user.whatsapp} styles={styles} />
        <DetailRow label="المدرسة" value={user.schoolName} styles={styles} />
        <DetailRow
          label="نوع التعليم"
          value={user.educationType}
          styles={styles}
        />
        <DetailRow
          label="سنة التعليم"
          value={user.educationYear}
          styles={styles}
        />
        <DetailRow
          label="تاريخ التسجيل"
          value={new Date(user.registerDate).toLocaleDateString()}
          styles={styles}
        />
      </View>

      <View style={styles.buttonRow}>
        <Button
          text="رفض"
          onPressEvent={() => handleStatusChange("REJECTED")}
          style={styles.rejectButton}
          loading={isPending}
        />
        <Button
          text="قبول"
          onPressEvent={() => handleStatusChange("APPROVED")}
          style={styles.acceptButton}
          loading={isPending}
        />
      </View>
    </ScrollView>
  );
}

const createStyles = (theme, fonts) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: 16,
      paddingBottom: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.background,
    },
    headerCard: {
      backgroundColor: theme.card.background,
      borderRadius: 20,
      padding: 22,
      borderWidth: 1,
      borderColor: theme.borderColor,
      marginBottom: 18,
      shadowColor: "#000",
      shadowOpacity: 0.07,
      shadowRadius: 14,
      elevation: 2,
    },
    name: {
      fontFamily: fonts.bold,
      fontSize: 22,
      color: theme.title,
      textAlign: "right",
    },
    subtitle: {
      fontFamily: fonts.regular,
      fontSize: 14,
      marginTop: 6,
      color: theme.textSecondary,
      textAlign: "right",
    },
    statusBadge: {
      marginTop: 14,
      alignSelf: "flex-start",
      backgroundColor: theme.section.color,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 999,
    },
    statusText: {
      fontFamily: fonts.bold,
      fontSize: 12,
      color: theme.secondary,
      textAlign: "center",
    },
    detailsCard: {
      backgroundColor: theme.inputField.background,
      borderRadius: 24,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.borderColor,
    },
    sectionTitle: {
      fontFamily: fonts.bold,
      fontSize: 16,
      color: theme.title,
      textAlign: "right",
      marginBottom: 14,
    },
    row: {
      flexDirection: "row-reverse",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    rowLabel: {
      fontFamily: fonts.medium,
      color: theme.textSecondary,
      fontSize: 14,
    },
    rowValue: {
      fontFamily: fonts.regular,
      color: theme.title,
      fontSize: 14,
      flex: 1,
      textAlign: "right",
      marginRight: 10,
    },
    buttonRow: {
      marginTop: 24,
      gap: 16,
    },
    acceptButton: {
      backgroundColor: "#22c55e",
      color: "#fff",
    },
    rejectButton: {
      backgroundColor: "#ef4444",
      color: "#fff",
    },
    errorText: {
      color: theme.section.color,
      fontFamily: fonts.regular,
      fontSize: 14,
      textAlign: "center",
    },
  });
