import { Text, View, StyleSheet } from "react-native";
import { useContext, useMemo } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import AttendanceCounter from "@/components/AttendanceCounter";
import { FontAwesome } from "@expo/vector-icons";
import AttendanceTile from "@/components/AttendanceTile";
export default function Attendance() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.counterContainer}>
        <AttendanceCounter counter={10} text="حضور" type="present" />
        <AttendanceCounter counter={10} text="تأخير" type="late" />
        <AttendanceCounter counter={10} text="غياب" type="absent" />
      </View>
      <View style={styles.sectionTitleContainer}>
        <FontAwesome
          name="calendar"
          size={24}
          color={theme.attendance.section.title}
        />
        <Text style={styles.sectionTitle}>تفاصيل الغياب والحضور</Text>
      </View>
      <AttendanceTile status="present" date="١٥ سبتمبر ٢٠٢٤" time=" ٠٨:٠٠ ص" />
      <AttendanceTile
        status="accepted_late"
        date="١٥ سبتمبر ٢٠٢٤"
        time=" ٠٨:٤٥ ص"
      />
      <AttendanceTile
        status="unaccepted_late"
        date="١٢ سبتمبر ٢٠٢٤"
        time=" ٠٨:٠٠ ص"
      />
      <AttendanceTile status="absent" date="١٤ سبتمبر ٢٠٢٤" />
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
