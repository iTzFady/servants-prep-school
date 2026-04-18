import { ThemeContext } from "@/context/ThemeContext";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { TouchableOpacity } from "react-native";
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
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            header: Header,
            headerTitle: "إعداد خدام",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => router.navigate("/profile")}
                href="/profile"
              >
                <Feather name="user" size={24} color={theme.header.color} />
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.navigate("/login")}>
                <Feather name="bell" size={24} color={theme.header.color} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="login" />
        <Stack.Screen
          name="register"
          options={{
            headerShown: true,
            header: Header,
            headerTitle: "تسجيل حساب جديد",
          }}
        />
        <Stack.Screen
          name="curriculum"
          options={{
            headerShown: true,
            header: Header,
            headerTitle: "المنهج",
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: true,
            header: Header,
            headerTitle: "الملف الشخصي",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.navigate("/qr-code")}>
                <MaterialIcons
                  name="qr-code-scanner"
                  size={24}
                  color={theme.header.color}
                />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
      <StatusBar style={colorScheme === "dark" ? "dark" : "light"} />
    </>
  );
}
