import { fonts } from "@/theme/fonts";
import { Pressable, StyleSheet, Text } from "react-native";
import { useMemo, useContext, memo } from "react";
import { ThemeContext } from "@/context/ThemeContext";

function CurriculumTypeChip({ text, icon, selected, onPressEvent }) {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  return (
    <Pressable
      style={[
        styles.container,
        selected
          ? { backgroundColor: theme.chips.selected.background }
          : { backgroundColor: theme.chips.unSelected.background },
      ]}
      onPress={onPressEvent}
    >
      {icon}
      <Text
        style={[
          styles.textStyle,
          selected
            ? { color: theme.chips.selected.color }
            : { color: theme.chips.unSelected.color },
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}
function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      height: 38,
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      marginHorizontal: 5,
    },
    textStyle: {
      fontFamily: fonts.medium,
      color: theme.chips.unSelected.color,
      fontSize: 12,
    },
  });
}

export default memo(CurriculumTypeChip);
