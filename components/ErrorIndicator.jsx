import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useContext, useMemo } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import Button from "./Button";

export default function ErrorIndicator({ state, text, onRetry, loading }) {
  const { theme } = useContext(ThemeContext);

  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  return state === "error" ? (
    <View style={styles.container}>
      <MaterialIcons name="error" size={34} color={styles.icon} />
      <Text style={styles.text}>{text}</Text>
      {onRetry && (
        <Button
          text="حاول مرة اخري"
          width="50%"
          loading={loading}
          style={styles.button}
          onPressEvent={onRetry}
          prefixIcon={<AntDesign name="reload" size={24} color="#ffffff" />}
        />
      )}
    </View>
  ) : (
    <View style={styles.container}>
      <AntDesign name="dropbox" size={34} color={styles.icon.color} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      gap: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: theme.section.color,
      textAlign: "center",
    },
    button: {
      backgroundColor: theme.login.button,
    },
    icon: {
      color: theme.section.color,
    },
  });
}
