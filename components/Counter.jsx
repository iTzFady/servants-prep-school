import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { memo, useContext, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
function Counter({ counter, text }) {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  counter = counter.toLocaleString("ar-EG");
  return (
    <View style={styles.counter}>
      <Text style={styles.text}>{counter}</Text>
      <Text style={styles.subText}>{text}</Text>
    </View>
  );
}

export default memo(Counter);

function createStyles(theme, fonts) {
  return StyleSheet.create({
    counter: {
      flex: 1,
      padding: 12,
      alignItems: "center",
      borderRadius: 10,
      elevation: 2,
      shadowColor: "#00000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      backgroundColor: theme.counter.background,
    },
    text: {
      fontSize: 18,
      fontFamily: fonts.bold,
      color: theme.counter.text,
    },
    subText: {
      fontSize: 10,
      fontFamily: fonts.regular,
      color: theme.counter.subText,
    },
  });
}
