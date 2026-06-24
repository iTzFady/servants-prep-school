import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import "@/utils/calendarLocale";
import { useContext, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Modal,
} from "react-native";
import Checkbox from "expo-checkbox";
import { Calendar } from "react-native-calendars";
import QRCode from "react-native-qrcode-svg";
import * as Sentry from "@sentry/react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { spiritualNoteActivities } from "@/data/spiritual-note";
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Button from "@/components/Button";

const today = new Date().toISOString().split("T")[0];

const initialRecords = {
  "2025-09-09": {
    bible: true,
    morning: true,
    evening: false,
    sleep: false,
    mass: false,
    confession: false,
  },

  "2025-09-10": {
    bible: true,
    morning: true,
    evening: true,
    sleep: true,
    mass: true,
    confession: true,
  },

  [today]: {
    bible: false,
    morning: false,
    evening: false,
    sleep: false,
    mass: false,
    confession: false,
  },
};
export default function SpiritualNote() {
  const [loading, setLoading] = useState(false);
  const { colorScheme, theme } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);

  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const [selectedDate, setSelectedDate] = useState(today);

  const [records, setRecords] = useState(initialRecords);

  const isToday = selectedDate === today;

  const selectedRecord = records[selectedDate] || {
    bible: false,
    morning: false,
    evening: false,
    sleep: false,
    mass: false,
    confession: false,
  };

  const markedDates = useMemo(() => {
    const result = {};

    Object.entries(records).forEach(([date, record]) => {
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
  }, [records, selectedDate]);

  const updateActivity = (key, value) => {
    if (!isToday) return;

    setRecords((prev) => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [key]: value,
      },
    }));
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.pageTitle}>اختر اليوم</Text>
        <View style={styles.calendarCard}>
          <Calendar
            current={selectedDate}
            maxDate={today}
            markedDates={markedDates}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
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
        <Text style={styles.sectionTitle}>قائمة المتابعة الروحية</Text>
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
                  {activity.description && (
                    <Text style={styles.rowDescription}>
                      {activity.description}
                    </Text>
                  )}
                </View>
              </View>
              <View>
                {activity.qr ? (
                  selectedRecord.confession ? (
                    <View style={[styles.approvedBadge, styles.badge]}>
                      <FontAwesome
                        name="check"
                        size={styles.badge.fontSize}
                        color="#fff"
                      />
                    </View>
                  ) : !selectedRecord.confession && !isToday ? (
                    <View style={[styles.disapprovedBadge, styles.badge]}>
                      <Entypo
                        name="cross"
                        size={styles.badge.fontSize}
                        color="#fff"
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={{
                        borderRadius: 5,
                        width: 30,
                        height: 30,
                        justifyContent: "center",
                        backgroundColor: theme.spiritualNote.qr,
                      }}
                      disabled={selectedRecord.confession}
                      onPress={() => setModalVisible(true)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          justifyContent: "center",
                        }}
                      >
                        {
                          <MaterialCommunityIcons
                            name="qrcode-scan"
                            size={15}
                            color="#fff"
                          />
                        }
                      </View>
                    </TouchableOpacity>
                  )
                ) : (
                  <Checkbox
                    value={selectedRecord[activity.key]}
                    disabled={!isToday}
                    onValueChange={(value) =>
                      updateActivity(activity.key, value)
                    }
                    color={selectedRecord[activity.key] ? "#B4233D" : undefined}
                  />
                )}
              </View>
            </View>
          ))}
        </View>
        <Button
          text="ارسال"
          onPressEvent={() => {
            Sentry.captureException(new Error("First error"));
          }}
          style={styles.button}
        />
      </ScrollView>
      <Modal
        onRequestClose={() => setModalVisible(false)}
        visible={modalVisible}
        transparent
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalVisible(false)}
          style={styles.overlayModal}
        >
          <View style={styles.card}>
            <Text style={styles.titleModal}>
              برجاء توجيه الهاتف نحو هاتف اب الاعتراف
            </Text>
            <View style={styles.qrContainer}>
              <QRCode
                size={180}
                value={JSON.stringify({
                  studentId: "123",
                  date: selectedDate,
                })}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
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
    rowDescription: {
      fontSize: 10,
      fontFamily: fonts.light,
      color: theme.spiritualNote.text,
    },
    badge: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 3,
      width: 20,
      height: 20,
      fontSize: 16,
    },
    approvedBadge: {
      backgroundColor: "#22C55E",
    },

    disapprovedBadge: {
      backgroundColor: "#b03939",
    },

    qrContainer: {
      backgroundColor: "#FFF",
      margin: 10,
      borderRadius: 20,
      alignItems: "center",
      width: 250,
      height: 250,
      justifyContent: "center",
    },

    overlayModal: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,.5)",
      justifyContent: "flex-end",
    },
    titleModal: {
      fontSize: 16,
      fontFamily: fonts.regular,
      color: theme.spiritualNote.text,
      textAlign: "center",
      paddingVertical: 15,
    },
    card: {
      backgroundColor: theme.spiritualNote.modal,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      gap: 12,
      alignItems: "center",
    },
    button: {
      backgroundColor: theme.register.button,
    },
  });
}
