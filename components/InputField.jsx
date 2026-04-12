import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { useContext, useMemo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
export default function InputField({
  text,
  autoCapitalize,
  autoComplete,
  inputMode,
  keyboardType,
  onChangeText,
  placeholder,
  suffixIcon,
  prefixIcon,
  secureTextEntry,
  value,
}) {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  return (
    <View style={styles.container}>
      <Text style={styles.TextFieldLabel}>{text}</Text>
      <View style={styles.TextFieldContainer}>
        {prefixIcon}
        <TextInput
          cursorColor={theme.textColor}
          style={styles.TextField}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          inputMode={inputMode}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={styles.TextFieldPlaceHolder.color}
          value={value}
          textAlignVertical="center"
        />
        {suffixIcon}
      </View>
    </View>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      width: "100%",
    },
    TextFieldContainer: {
      height: 50,
      flexDirection: "row-reverse",
      gap: 10,
      alignItems: "center",
      paddingHorizontal: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.borderColor,
      backgroundColor: "#F8FAFC",
    },
    TextFieldLabel: {
      fontFamily: fonts.medium,
      fontSize: 14,
      marginVertical: 5,
      width: "100%",
      textAlign: "right",
      color: theme.textSecondary,
    },
    TextField: {
      flex: 1,
      color: theme.text,
      fontFamily: fonts.regular,
      textAlign: "right",
    },
    TextFieldPlaceHolder: {
      color: theme.text,
    },
  });
}
