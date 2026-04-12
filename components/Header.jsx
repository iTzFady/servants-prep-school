import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { Feather } from "@expo/vector-icons";
import { useContext } from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Header(props) {
  const { theme, colorScheme } = useContext(ThemeContext);

  return (
    <SafeAreaView
      style={{
        height: 120,
        backgroundColor: theme.secondary,
        flexDirection: "row-reverse",
        alignItems: "center",
        paddingHorizontal: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }}
    >
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <Feather name="arrow-right" size={20} color={theme.primary} />
      </TouchableOpacity>
      <Text
        style={{
          color: theme.primary,
          fontSize: 18,
          fontFamily: fonts.bold,
          marginHorizontal: "auto",
        }}
      >
        {props.options.headerTitle}
      </Text>
      {props.options.headerLeft && props.options.headerLeft()}
    </SafeAreaView>
  );
}
