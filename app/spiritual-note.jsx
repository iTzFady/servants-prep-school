import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import "@/utils/calendarLocale";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Checkbox } from "expo-checkbox";
import { Calendar } from "react-native-calendars";
import QRCode from "react-native-qrcode-svg";
import * as Sentry from "@sentry/react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { spiritualNoteActivities } from "@/data/spiritual-note";
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Button from "@/components/Button";
import Toast from "react-native-toast-message";
import { useAppSelector } from "@/store/hooks";
import {
  useSpiritualNoteSubmissions,
  useSubmitSpiritualNote,
} from "@/hooks/useSpiritualNote";
import LoadingIndicator from "@/components/LoadingIndicator";

const today = new Date().toISOString().split("T")[0];

const initialRecords = {
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
  const { colorScheme, theme } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);

  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarCurrentDate, setCalendarCurrentDate] = useState(today);

  const [records, setRecords] = useState(initialRecords);
  const [submittedToday, setSubmittedToday] = useState({
    bible: false,
    morning: false,
    evening: false,
    sleep: false,
    mass: false,
    confession: false,
  });

  const user = useAppSelector((state) => state.auth.user);
  const monthKey = useMemo(
    () => calendarCurrentDate.slice(0, 7),
    [calendarCurrentDate],
  );
  const {
    data: submissions,
    error,
    isError,
    isPending,
    refetch,
  } = useSpiritualNoteSubmissions(monthKey);
  const submitSpiritualNote = useSubmitSpiritualNote();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!submissions) return;

    setRecords((prev) => ({
      ...prev,
      ...submissions,
    }));

    setSubmittedToday(
      submissions[today] || {
        bible: false,
        morning: false,
        evening: false,
        sleep: false,
        mass: false,
        confession: false,
      },
    );
  }, [submissions]);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const isToday = selectedDate === today;

  const selectedRecord = records[selectedDate] || {
    bible: false,
    morning: false,
    evening: false,
    sleep: false,
    mass: false,
    confession: false,
  };

  const getApiSubmissionValues = (record, alreadySubmitted = {}) => {
    const map = {
      morning: "MORNINGPRAYER",
      evening: "NOONPRAYER",
      sleep: "NIGHTPRAYER",
      mass: "LITURGY",
      bible: "BIBLE",
      confession: "CONFESSION",
    };

    return Object.entries(record)
      .filter(([key, value]) => value && !alreadySubmitted[key])
      .map(([key]) => map[key])
      .filter(Boolean);
  };

  const activitiesToDisplay = error
    ? spiritualNoteActivities.filter(
        (activity) => activity.key === "confession",
      )
    : spiritualNoteActivities;

  const submissionValuesToSend = getApiSubmissionValues(
    selectedRecord,
    isToday ? submittedToday : {},
  );

  const isSubmitDisabled = isToday && submissionValuesToSend.length === 0;

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

  if (isPending) return <LoadingIndicator />;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
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
          {activitiesToDisplay.map((activity) => (
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
                  ) : !selectedRecord.confession && !isToday && !isError ? (
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
                    disabled={
                      !isToday ||
                      (isToday && submittedToday[activity.key]) ||
                      isError
                    }
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
        {isToday && !isError && (
          <Button
            text={"ارسال"}
            loading={submitSpiritualNote.isPending}
            disabled={isSubmitDisabled}
            onPressEvent={() => {
              if (!submissionValuesToSend.length) {
                Toast.show({
                  type: "info",
                  text1: "لا يوجد نشاط جديد للإرسال",
                  text2: "لقد سبق إرسال الأنشطة الحالية",
                });
                return;
              }

              submitSpiritualNote.mutate(
                { submission: submissionValuesToSend },
                {
                  onSuccess: () => {
                    Toast.show({
                      type: "success",
                      text1: "تمت العملية",
                      text2: "تم حفظ المتابعة الروحية",
                    });
                  },
                  onError: (error) => {
                    Sentry.captureException(error);
                    Toast.show({
                      type: "error",
                      text1: "تعذر حفظ المتابعة الروحية",
                      text2: error?.message || "حاول مرة أخرى",
                    });
                  },
                },
              );
            }}
            style={styles.button}
          />
        )}
      </ScrollView>
      <Modal
        onRequestClose={() => setModalVisible(false)}
        visible={modalVisible}
        transparent
        statusBarTranslucent
        navigationBarTranslucent
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalVisible(false)}
          style={styles.overlayModal}
        >
          <View style={[styles.card, { paddingBottom: insets.bottom }]}>
            <Text style={styles.titleModal}>
              برجاء توجيه الهاتف نحو هاتف اب الاعتراف
            </Text>
            <View style={styles.qrContainer}>
              <QRCode size={180} value={String(user?.id)} />
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
      ...StyleSheet.absoluteFill,
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
