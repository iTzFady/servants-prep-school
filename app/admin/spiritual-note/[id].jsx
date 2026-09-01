import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import "@/utils/calendarLocale";
import { useCallback, useContext, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Checkbox } from "expo-checkbox";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { spiritualNoteActivities } from "@/data/spiritual-note";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAdminSpiritualNoteSubmissions } from "@/hooks/useSpiritualNote";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useLocalSearchParams } from "expo-router";
import ErrorIndicator from "@/components/ErrorIndicator";

const today = new Date().toISOString().split("T")[0];

const defaultSubmission = {
  bible: false,
  morning: false,
  evening: false,
  sleep: false,
  mass: false,
  confession: false,
};

const initialRecords = {
  [today]: { ...defaultSubmission },
};

export default function SpiritualNoteDetails() {
  const { colorScheme, theme } = useContext(ThemeContext);
  const { id } = useLocalSearchParams();
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarCurrentDate, setCalendarCurrentDate] = useState(today);

  const monthKey = useMemo(
    () => calendarCurrentDate.slice(0, 7),
    [calendarCurrentDate],
  );
  const {
    data: submissions,
    error,
    isPending,
    refetch,
  } = useAdminSpiritualNoteSubmissions(id, monthKey);

  const effectiveRecords = useMemo(
    () => ({
      ...initialRecords,
      ...(submissions ?? {}),
    }),
    [submissions],
  );

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const selectedRecord = effectiveRecords[selectedDate] || defaultSubmission;

  const markedDates = useMemo(() => {
    const result = {};

    Object.entries(effectiveRecords).forEach(([date, record]) => {
      const completedCount = Object.values(record).filter(Boolean).length;

      let color = "#D9D9D9";

      if (record.confession) {
        color = "#7C3AED";
      } else if (completedCount >= 5) {
        color = "#22C55E";
      } else if (completedCount > 0) {
        color = "#F59E0B";
      }

      result[date] = {
        selected: true,
        selectedColor: color,
      };
    });

    result[selectedDate] = {
      ...(result[selectedDate] || {}),
      selected: true,
      selectedColor: "#333",
    };

    return result;
  }, [effectiveRecords, selectedDate]);

  if (isPending) return <LoadingIndicator />;

  if (error) {
    return (
      <ErrorIndicator state="error" text={error.message} onRetry={onRefresh} />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>اختر اليوم</Text>
        <View style={styles.calendarCard}>
          <Calendar
            current={calendarCurrentDate}
            maxDate={today}
            markedDates={markedDates}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setCalendarCurrentDate(day.dateString);
            }}
            onMonthChange={(month) => {
              const monthString = String(month.month).padStart(2, "0");
              setCalendarCurrentDate(`${month.year}-${monthString}-01`);
            }}
            renderArrow={(direction) => (
              <MaterialCommunityIcons
                name={direction === "left" ? "chevron-right" : "chevron-left"}
                size={22}
                color={theme.spiritualNote.text}
              />
            )}
            theme={{
              backgroundColor: theme.spiritualNote.cardBackground,
              calendarBackground: theme.spiritualNote.cardBackground,
              monthTextColor: theme.spiritualNote.text,
              textMonthFontFamily: fonts.bold,

              dayTextColor: theme.spiritualNote.text,
              textDayFontFamily: fonts.medium,

              textDisabledColor: colorScheme === "dark" ? "#475569" : "#CBD5E1",

              todayTextColor: theme.primary,

              arrowColor: theme.primary,

              textSectionTitleColor:
                colorScheme === "dark" ? "#94A3B8" : "#64748B",

              selectedDayBackgroundColor: theme.primary,
              selectedDayTextColor: "#fff",
              textDayHeaderFontFamily: fonts.medium,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text style={styles.sectionTitle}>قائمة المتابعة الروحية</Text>
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons
              name="reload"
              size={18}
              color={theme.spiritualNote.text}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.list}>
          {spiritualNoteActivities.map((activity) => (
            <View key={activity.key} style={styles.row}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                {activity.icon &&
                  activity.icon({ color: theme.iconButton.icon })}
                <View>
                  <Text style={styles.rowTitle}>{activity.title}</Text>
                </View>
              </View>
              <View>
                <Checkbox
                  value={selectedRecord[activity.key]}
                  disabled={true}
                  color={selectedRecord[activity.key] ? "#B4233D" : undefined}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },

    content: {
      padding: 16,
    },

    pageTitle: {
      fontFamily: fonts.bold,
      marginBottom: 16,
      color: theme.spiritualNote.text,
    },

    calendarCard: {
      backgroundColor: theme.spiritualNote.cardBackground,
      borderRadius: 20,
      padding: 8,
      marginBottom: 24,
    },

    sectionTitle: {
      fontFamily: fonts.bold,
      marginBottom: 20,
      color: theme.spiritualNote.text,
    },

    list: {
      gap: 12,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.spiritualNote.cardBackground,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 14,
    },

    rowTitle: {
      fontSize: 14,
      fontFamily: fonts.medium,
      color: theme.spiritualNote.text,
    },
  });
}
