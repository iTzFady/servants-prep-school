import { Feather } from "@expo/vector-icons";
import { useContext, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { apiClient } from "@/services/apiClient";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorIndicator from "@/components/ErrorIndicator";

const notificationTypeMap = {
  clipboard: "clipboard",
  bell: "bell",
  check: "check-circle",
  chart: "bar-chart-2",
  clock: "clock",
};

const getNotificationMeta = (notification) => {
  const lowerTitle = (notification?.title || "").toLowerCase();
  const lowerBody = (notification?.body || "").toLowerCase();

  if (lowerBody.includes("نتيجة") || lowerTitle.includes("نتيجة")) {
    return { type: "bar-chart-2", color: "#2563EB" };
  }

  if (lowerBody.includes("حضور") || lowerTitle.includes("حضور")) {
    return { type: "check-circle", color: "#16A34A" };
  }

  if (lowerBody.includes("تذكير") || lowerTitle.includes("تذكير")) {
    return { type: "bell", color: "#D97706" };
  }

  if (lowerBody.includes("واجب") || lowerTitle.includes("واجب")) {
    return { type: "clipboard", color: "#B51D36" };
  }

  return {
    type: notificationTypeMap.clock,
    color: "#64748B",
  };
};

const formatNotificationTime = (value) => {
  if (!value) return "الآن";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "الآن";

  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));

  if (diffHours < 24) return `منذ ${diffHours} ساعة`;

  const diffDays = Math.max(1, Math.round(diffHours / 24));
  return `منذ ${diffDays} يوم`;
};

export default function Notifications() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["push-notifications"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v2/push-notifications");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const notifications = data.map((item) => ({
    ...item,
    ...getNotificationMeta(item),
    time: formatNotificationTime(item.createdAt),
    unread: true,
  }));

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.screen, { backgroundColor: theme.background }]}
        edges={["bottom"]}
      >
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.screen, { backgroundColor: theme.background }]}
        edges={["bottom"]}
      >
        <ErrorIndicator
          state="error"
          text={error.message || "تعذر تحميل الإشعارات"}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: theme.background }]}
      edges={["bottom"]}
    >
      <ScrollView>
        {notifications
          .slice(0, Math.min(3, notifications.length))
          .map((n, i) => (
            <Notification key={n.id || i} n={n} theme={theme} styles={styles} />
          ))}

        {notifications.length > 3 && (
          <>
            <Text style={[styles.heading, { color: theme.textSecondary }]}>
              سابقاً
            </Text>
            {notifications.slice(3).map((n, i) => (
              <Notification
                key={n.id || `older-${i}`}
                n={n}
                theme={theme}
                styles={styles}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Notification({ n, theme, styles }) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.secondary, borderColor: theme.borderColor },
        n.unread && styles.unread,
      ]}
    >
      <View style={[styles.icon, { backgroundColor: `${n.color}16` }]}>
        <Feather name={n.type} size={20} color={n.color} />
      </View>
      <View style={styles.copy}>
        <View style={styles.line}>
          <Text style={[styles.title, { color: theme.title }]}>{n.title}</Text>
          {n.unread && <View style={styles.dot} />}
        </View>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          {n.body}
        </Text>
        <Text style={[styles.time, { color: theme.textSecondary }]}>
          {n.time}
        </Text>
      </View>
    </View>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    screen: { flex: 1 },
    tabs: {
      height: 55,
      borderBottomWidth: 1,
      paddingHorizontal: 16,
      flexDirection: "row",
      gap: 30,
      alignItems: "center",
    },
    tab: { fontFamily: fonts.medium, fontSize: 12 },
    tabActive: {
      fontFamily: fonts.bold,
      fontSize: 12,
      color: theme.primary,
      borderBottomWidth: 2,
      borderColor: theme.primary,
      height: 55,
      textAlignVertical: "center",
    },
    heading: {
      fontFamily: fonts.bold,
      fontSize: 13,
      marginHorizontal: 16,
      marginTop: 22,
      marginBottom: 8,
      textAlign: "right",
    },
    card: {
      minHeight: 105,
      marginHorizontal: 16,
      marginTop: 10,
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: "row",
      gap: 12,
    },
    unread: { borderRightWidth: 3, borderRightColor: theme.primary },
    icon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    copy: { flex: 1 },
    line: { flexDirection: "row", alignItems: "center", gap: 7 },
    title: {
      fontFamily: fonts.bold,
      fontSize: 13,
      flex: 1,
      textAlign: "right",
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: theme.primary,
    },
    body: {
      fontFamily: fonts.regular,
      fontSize: 11,
      lineHeight: 18,
      textAlign: "right",
      marginTop: 4,
    },
    time: {
      fontFamily: fonts.regular,
      fontSize: 10,
      textAlign: "right",
      marginTop: 5,
    },
  });
}
