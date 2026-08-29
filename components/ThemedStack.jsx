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
            header: (props) => <Header {...props} />,
            headerTitle: "إعداد خدام",
            headerRight: () => (
              <TouchableOpacity onPress={() => router.navigate("/settings")}>
                <Feather name="settings" size={24} color={theme.header.color} />
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.navigate("/notifications")}
              >
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
            header: (props) => <Header {...props} />,
            headerTitle: "تسجيل حساب جديد",
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "الاعدادت",
          }}
        />
        <Stack.Screen
          name="curriculum"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "المنهج",
          }}
        />
        <Stack.Screen
          name="curriculum/[id]"
          options={({ route }) => ({
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: `${getCurriculumLabel(route.params?.id)}`,
          })}
        />
        <Stack.Screen
          name="attendance"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "سجل الحضور والغياب",
          }}
        />
        <Stack.Screen
          name="assignments/index"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "الواجبات",
          }}
        />
        <Stack.Screen
          name="assignments/[id]"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "حل الواجب",
          }}
        />
        <Stack.Screen
          name="archive/index"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "الأرشيف",
          }}
        />
        <Stack.Screen
          name="archive/[id]"
          options={({ route }) => ({
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: `${route.params?.name || "تفاصيل الألبوم"}`,
          })}
        />
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "الإشعارات",
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
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
            header: (props) => <Header {...props} />,
            headerTitle: "تسجيل الحضور",
          }}
        />
        <Stack.Screen
          name="spiritual-note"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "النوتة الروحية",
          }}
        />
        <Stack.Screen
          name="results"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "النتائج",
          }}
        />
        {/* Admin Screens */}
        <Stack.Screen
          name="admin/index"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "إعداد خدام",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => router.navigate("admin/settings")}
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
        <Stack.Screen
          name="admin/settings"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "الاعدادت",
          }}
        />

        <Stack.Screen
          name="admin/accounts/index"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "ادارة الحسابات",
          }}
        />
        <Stack.Screen
          name="admin/accounts/[id]"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "تفاصيل الاستمارة",
          }}
        />
        <Stack.Screen
          name="admin/details/[id]"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "تفاصيل الحساب",
          }}
        />
        <Stack.Screen
          name="admin/curriculum/index"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "ادارة المناهج",
          }}
        />
        <Stack.Screen
          name="admin/curriculum/[id]"
          options={({ route }) => ({
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: `${getCurriculumLabel(route.params?.id)}`,
          })}
        />
        <Stack.Screen
          name="admin/curriculum/create"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "إضافة محاضرة جديدة",
          }}
        />
        <Stack.Screen
          name="admin/students"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "بيانات المخدومين",
          }}
        />
        <Stack.Screen
          name="admin/attendance/qr"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "تسجيل الحضور",
          }}
        />
        <Stack.Screen
          name="admin/attendance/manual"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "تسجيل الحضور يدويا",
          }}
        />
        <Stack.Screen
          name="admin/attendance/index"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "ادارة الحضور و الغياب",
          }}
        />
        <Stack.Screen
          name="admin/attendance/[id]"
          options={({ route }) => ({
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: `${route.params?.name}`,
          })}
        />
        <Stack.Screen
          name="admin/attendance/list"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "متابعة الحضور",
          }}
        />
        <Stack.Screen
          name="admin/results"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "ادارة النتائج",
          }}
        />
        <Stack.Screen
          name="admin/results/[id]"
          options={({ route }) => ({
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: `${route.params?.name || "نتائج الطالب"}`,
          })}
        />
        <Stack.Screen
          name="admin/spiritual-note"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "ادارة النوتة الروحية",
          }}
        />
        <Stack.Screen
          name="admin/spiritual-note/[id]"
          options={({ route }) => ({
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: `${route.params?.name}`,
          })}
        />
        <Stack.Screen
          name="admin/spiritual-note/list"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "قائمة الطلاب",
          }}
        />
        <Stack.Screen
          name="admin/spiritual-note/confession/manual"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "الاعتراف",
          }}
        />
        <Stack.Screen
          name="admin/spiritual-note/confession/qr"
          options={{
            headerShown: true,
            header: (props) => <Header {...props} />,
            headerTitle: "الاعتراف",
          }}
        />
      </Stack>
      <StatusBar
        animated={true}
        style={colorScheme === "dark" ? "light" : "dark"}
      />
    </>
  );
}
