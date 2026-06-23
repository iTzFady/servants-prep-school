import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { memo, useContext, useMemo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
function InputField({ text, prefixIcon, suffixIcon, style, error, ...props }) {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  return (
    <View style={styles.container}>
      <Text style={styles.TextFieldLabel}>{text}</Text>
      <View style={[styles.TextFieldContainer, error && styles.errorContainer]}>
        {prefixIcon}

        <TextInput
          {...props}
          accessibilityLabel={text}
          accessibilityState={{
            invalid: !!error,
          }}
          cursorColor={theme.textColor}
          style={[styles.TextField, style]}
          placeholderTextColor={styles.TextFieldPlaceHolder.color}
        />

        {suffixIcon}
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

export default memo(InputField);

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      width: "100%",
    },
    TextFieldContainer: {
      height: 50,
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
      paddingHorizontal: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.inputField.borderColor,
      backgroundColor: theme.inputField.background,
    },
    TextFieldLabel: {
      fontFamily: fonts.medium,
      fontSize: 14,
      marginVertical: 5,
      width: "100%",
      color: theme.inputField.label,
    },
    TextField: {
      flex: 1,
      color: theme.inputField.color,
      fontFamily: fonts.regular,
      textAlign: "right",
    },
    TextFieldPlaceHolder: {
      color: theme.inputField.color,
    },
    errorText: {
      color: "#ef4444",
      marginTop: 4,
      fontSize: 12,
      fontFamily: fonts.light,
    },
    errorContainer: {
      borderColor: "#ef4444",
    },
  });
}
