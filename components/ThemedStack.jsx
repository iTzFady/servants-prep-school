import { ThemeContext } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import Header from "./Header";

export default function ThemedStack() {
  const { theme, colorScheme } = useContext(ThemeContext);
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
          contentStyle: {
            backgroundColor: theme.background,
          },
          headerShadowVisible: true,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen
          name="register"
          options={{
            headerShown: true,
            header: Header,
            headerTitle: "تسجيل حساب جديد",
          }}
        />
      </Stack>
      <StatusBar style={colorScheme === "dark" ? "dark" : "light"} />
    </>
  );
}
