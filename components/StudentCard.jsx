import { Pressable, View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useContext, useMemo } from "react";
import { fonts } from "@/theme/fonts";
import { ThemeContext } from "@/context/ThemeContext";
import dateUtils from "@/utils/dateFormatter";
export default function StudentCard({ item, onPress }) {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyle(theme, fonts), [theme]);
  return (
    <Pressable style={styles.userCard} onPress={onPress}>
      <View style={styles.userInfo}>
        {item.pfpUrl ? (
          <Image src={item.pfpUrl} style={styles.avatar} />
        ) : (
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        )}
        <View style={styles.userText}>
          <Text style={styles.userName}>{item.name}</Text>
          {item.registerDate && (
            <Text style={styles.regDate}>
              {`تاريخ التسجيل : ${dateUtils.arabicDate(item.registerDate)}`}
            </Text>
          )}
          {item.servantPrepYear && (
            <Text
              style={styles.regDate}
            >{`${item.servantPrepYear === "1" ? "اولي اعداد خدام" : "تانية اعداد خدام"}`}</Text>
          )}
        </View>
      </View>
      <MaterialIcons
        name="keyboard-arrow-left"
        size={24}
        color={theme.section.color}
      />
    </Pressable>
  );
}

function createStyle(theme, fonts) {
  return StyleSheet.create({
    userCard: {
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.admin.StudentCard.background,
      borderRadius: 18,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.admin.StudentCard.border,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 16,
      elevation: 2,
    },
    userInfo: {
      flexDirection: "row-reverse",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 14,
      backgroundColor: theme.section.color,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      width: 50,
      height: 50,
      borderRadius: 14,
      textAlign: "center",
      verticalAlign: "middle",
      color: "#000",
      fontFamily: fonts.medium,
      fontSize: 16,
      backgroundColor: theme.section.color,
      justifyContent: "center",
      alignItems: "center",
    },

    userText: {
      flex: 1,
    },
    userName: {
      fontFamily: fonts.bold,
      fontSize: 16,
      color: theme.title,
      textAlign: "right",
    },
    regDate: {
      fontFamily: fonts.regular,
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: "right",
    },
  });
}
