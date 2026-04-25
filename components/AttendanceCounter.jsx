import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { memo, useContext, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const STATUS_CONFIG = {
  absent: {
    background: "#FFF1F2",
    border: "#FFE4E6",
    color: "#881337",
    icon: "close",
    iconColor: "#E11D48",
  },
  present: {
    background: "#ECFDF5",
    border: "#D1FAE5",
    color: "#065F46",
    icon: "check",
    iconColor: "#059669",
  },
  late: {
    background: "#FFFBEB",
    border: "#FEF3C7",
    color: "#92400E",
    icon: "info",
    iconColor: "#D97706",
  },
};

function AttendanceCounter({ counter, text, type }) {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);

  const config = STATUS_CONFIG[type] || STATUS_CONFIG.present;

  counter = counter.toLocaleString("ar-EG");

  return (
    <View
      style={[
        styles.counter,
        {
          borderColor: config.border,
          borderWidth: 1,
          backgroundColor: config.background,
        },
      ]}
    >
      <MaterialIcons name={config.icon} size={20} color={config.iconColor} />

      <Text style={[styles.subText, { color: config.color }]}>{text}</Text>
      <Text style={[styles.text, { color: config.color }]}>{counter}</Text>
    </View>
  );
}

export default memo(AttendanceCounter);

function createStyles(theme, fonts) {
  return StyleSheet.create({
    counter: {
      flex: 1,
      padding: 12,
      alignItems: "center",
      borderRadius: 10,
      gap: 8,
    },
    text: {
      fontSize: 20,
      fontFamily: fonts.bold,
    },
    subText: {
      fontSize: 14,
      fontFamily: fonts.regular,
    },
  });
}
