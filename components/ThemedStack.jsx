import { ThemeContext } from "@/context/ThemeContext";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import Header from "./Header";
import { getCurriculumLabel } from "@/data/tabs";
import { useAppSelector } from "@/store/hooks";
import Toast from "react-native-toast-message";
export default function ThemedStack() {
  const { theme, colorScheme } = useContext(ThemeContext);
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      const role = user?.role?.toLowerCase?.() || "";
      if (role === "admin" || role === "superadmin") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, user?.role, router]);
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
                onPress={() => router.navigate("/settings")}
                href="/profile"
              >
                <Feather name="settings" size={24} color={theme.header.color} />
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity
                // onPress={() => router.navigate("/notifications")}
                onPress={() =>
                  Toast.show({
                    type: "info",
                    text1: "لم يتم اضافة هذه الميزة في الوقت الحالي",
                    text2: "سيتم اضافة هذه الميزة في اسرع وقت",
                  })
                }
              >
                <Feather name="bell" size={24} color={theme.header.color} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="admin" />
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
          name="settings"
          options={{
            headerShown: true,
            header: Header,
            headerTitle: "الاعدادت",
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
          name="attendance"
          options={{
            headerShown: true,
            header: Header,
            headerTitle: "سجل الحضور والغياب",
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
        <Stack.Screen
          name="qr-code"
          options={{
            headerShown: true,
            header: Header,
            headerTitle: "تسجيل الحضور",
          }}
        />
        <Stack.Screen
          name="curriculum/[id]"
          options={({ route }) => ({
            headerShown: true,
            header: Header,
            headerTitle: `${getCurriculumLabel(route.params?.id)}`,
          })}
        />
      </Stack>
      <StatusBar style={colorScheme === "dark" ? "dark" : "light"} />
    </>
  );
}
