import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useCallback, useContext, useMemo, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import AttendanceCounter from "@/components/AttendanceCounter";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AttendanceTile from "@/components/AttendanceTile";
import { useAdminAttendance } from "@/hooks/useApi";
import { useLocalSearchParams } from "expo-router";

export default function AttendanceLogs() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const { id } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useAdminAttendance(id);
  const [refreshing, setRefreshing] = useState(false);

  const presentCount = data?.count.present ?? 0;
  const absentCount = data?.count.absent ?? 0;
  const lateCount =
    (data?.count.excusedLate ?? 0) + (data?.count.unexcusedLate ?? 0);
  const records = data?.attendanceRecords ?? [];
  const renderItems = useCallback(
    ({ item }) => (
      <AttendanceTile key={item.id} status={item.status} date={item.date} />
    ),
    [],
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  if (isLoading)
    return (
      <ActivityIndicator
        style={{ flex: 1, marginHorizontal: "auto", marginVertical: "auto" }}
        color={theme.title}
      />
    );

  if (error)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialIcons name="error" size={34} color={theme.title} />
        <Text
          style={{
            textAlign: "center",
            color: theme.title,
            fontFamily: fonts.medium,
          }}
        >
          لقد حدث خطأ
        </Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.counterContainer}>
        <AttendanceCounter counter={presentCount} text="حضور" type="present" />
        <AttendanceCounter counter={lateCount} text="تأخير" type="late" />
        <AttendanceCounter counter={absentCount} text="غياب" type="absent" />
      </View>

      <View style={styles.sectionTitleContainer}>
        <FontAwesome
          name="calendar"
          size={24}
          color={theme.attendance.section.title}
        />
        <Text style={styles.sectionTitle}>تفاصيل الغياب والحضور</Text>
      </View>

      {!isLoading && !error && records.length === 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="error" size={34} color={theme.title} />
          <Text
            style={{
              textAlign: "center",
              color: theme.title,
              fontFamily: fonts.medium,
            }}
          >
            لا توجد سجلات حضور حتى الآن
          </Text>
        </View>
      )}

      <FlatList
        data={records}
        renderItem={renderItems}
        onRefresh={onRefresh}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15 }}
      />
    </View>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
      gap: 10,
    },
    counterContainer: {
      flexDirection: "row-reverse",
      gap: 12,
      padding: 16,
    },
    sectionTitleContainer: {
      flexDirection: "row-reverse",
      gap: 6,
      alignItems: "center",
    },
    sectionTitle: {
      color: theme.attendance.section.title,
      fontSize: 16,
      fontFamily: fonts.bold,
    },
  });
}
