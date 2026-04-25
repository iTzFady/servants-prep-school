import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { memo, useContext, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
function IconButton({ icon, onPress, title, description }) {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {icon && (
        <View style={styles.iconContainer}>
          {icon({ color: theme.iconButton.icon })}
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </TouchableOpacity>
  );
}

export default memo(IconButton);

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.secondary,
      flex: 1,
      margin: 10,
      height: 150,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    iconContainer: {
      padding: 20,
      borderRadius: 50,
      backgroundColor: theme.iconButton.iconBackground,
    },
    icon: {
      color: theme.iconButton.icon,
    },
    title: {
      fontFamily: fonts.bold,
      fontSize: 16,
      color: theme.iconButton.title,
    },
    description: {
      fontFamily: fonts.regular,
      fontSize: 10,
      color: theme.iconButton.subtitle,
    },
  });
}
