import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { useContext, useMemo } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function DetailTile({ text, subText }) {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.subText}>{subText}</Text>
    </View>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.admin.StudentCard.background,
      padding: 16,
      alignItems: "flex-end",
      gap: 5,
      borderRadius: 10,
      flex: 1,
    },
    text: {
      color: theme.admin.StudentCard.color,
      fontFamily: fonts.light,
      fontSize: 12,
    },
    subText: {
      fontFamily: fonts.medium,
      fontSize: 16,
      color: theme.admin.StudentCard.color,
    },
  });
}
