import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { memo, useContext, useMemo } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
function TileButton({ text, icon, onPress }) {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View
        style={{
          flex: 1,
          flexDirection: "row-reverse",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View style={styles.iconContainer}>
          {icon({ color: theme.settings.iconButton.icon })}
        </View>
        <Text style={styles.tileTitle}>{text}</Text>
      </View>
      <MaterialIcons
        name="keyboard-arrow-left"
        size={24}
        color={styles.tileTitle.color}
      />
    </TouchableOpacity>
  );
}

export default memo(TileButton);

function createStyles(theme, fonts) {
  return StyleSheet.create({
    button: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      gap: 16,
      alignItems: "center",
      flexDirection: "row-reverse",
    },
    iconContainer: {
      padding: 14,
      borderRadius: 10,
      backgroundColor: theme.settings.iconButton.iconBackground,
    },
    tileTitle: {
      fontFamily: fonts.medium,
      fontSize: 16,
      color: theme.settings.iconButton.title,
    },
  });
}
