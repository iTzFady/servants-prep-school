import { StyleSheet, Switch, View, Text } from "react-native";
import { memo, useContext, useMemo } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
function ToggleButton({ text, icon, onPress, state }) {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  return (
    <View style={styles.button}>
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
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Switch
          trackColor={{
            false: theme.settings.toggleButton.off.track,
            true: theme.settings.toggleButton.on.track,
          }}
          thumbColor={
            state
              ? theme.settings.toggleButton.on.thumb
              : theme.settings.toggleButton.off.thumb
          }
          value={state}
          onValueChange={onPress}
        />
      </View>
    </View>
  );
}

export default memo(ToggleButton);

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
