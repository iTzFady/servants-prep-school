import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { Feather } from "@expo/vector-icons";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function Header(props) {
  const { theme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, backgroundColor: theme.secondary }}>
      <View
        style={{
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        {props.options.headerRight ? (
          props.options.headerRight()
        ) : (
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Feather name="arrow-right" size={20} color={theme.header.color} />
          </TouchableOpacity>
        )}
        <Text
          style={{
            color: theme.header.color,
            fontSize: 18,
            fontFamily: fonts.bold,
            textAlign: "center",
          }}
          ellipsizeMode="tail"
        >
          {props.options.headerTitle}
        </Text>
        {props.options.headerLeft ? props.options.headerLeft() : <View></View>}
      </View>
    </View>
  );
}
