import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { memo, useContext, useMemo } from "react";
import { Text, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
const STATUS_CONFIG = {
  absent: {
    background: "#FFF1F2",
    border: "#FFE4E6",
    color: "#881337",
    icon: "close",
    iconColor: "#E11D48",
    status: "غائب",
  },
  present: {
    background: "#D1FAE5",
    border: "#D1FAE5",
    color: "#047857",
    icon: "check",
    iconColor: "#059669",
    status: "حاضر",
  },
  accepted_late: {
    background: "#FFFBEB",
    border: "#FEF3C7",
    color: "#92400E",
    icon: "info",
    iconColor: "#D97706",
    status: "تأخير مقبول",
  },
  unaccepted_late: {
    background: "#F5F3FF",
    border: "#DDD6FE",
    color: "#5B21B6",
    icon: "info",
    iconColor: "#7C3AED",
    status: "تأخير غير مقبول",
  },
};

function AttendanceTile({ date, time = "غائب", status }) {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.present;
  date = date.toLocaleString("ar-EG");
  time = time.toLocaleString("ar-EG");
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "row-reverse",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: config.background }]}
        >
          <MaterialIcons
            name={config.icon}
            size={20}
            color={config.iconColor}
          />
        </View>
        <View>
          <Text style={styles.title}>{date}</Text>
          <Text style={styles.describtion}>{time}</Text>
        </View>
      </View>
      <Text
        style={[
          styles.status,
          { backgroundColor: config.background, color: config.color },
        ]}
      >
        {config.status}
      </Text>
    </View>
  );
}

export default memo(AttendanceTile);

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flexDirection: "row-reverse",
      backgroundColor: theme.attendance.tile.background,
      borderWidth: 1,
      borderColor: theme.attendance.tile.border,
      borderRadius: 12,
      padding: 12,
      alignItems: "center",
      gap: 12,
      alignContent: "space-between",
    },
    iconContainer: {
      padding: 20,
      borderRadius: 50,
    },
    title: {
      fontSize: 14,
      fontFamily: fonts.bold,
      textAlign: "right",
      color: theme.attendance.tile.color,
    },
    describtion: {
      fontSize: 12,
      fontFamily: fonts.regular,
      textAlign: "right",
      color: theme.attendance.tile.color,
    },
    status: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      fontFamily: fonts.bold,
      fontSize: 12,
    },
  });
}
