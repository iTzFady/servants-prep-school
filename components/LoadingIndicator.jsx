import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import { ActivityIndicator } from "react-native";

export default function LoadingIndicator({ size = "small" }) {
  const { theme } = useContext(ThemeContext);
  return (
    <ActivityIndicator
      size={size}
      style={{ flex: 1, marginHorizontal: "auto", marginVertical: "auto" }}
      color={theme.section.color}
    />
  );
}
