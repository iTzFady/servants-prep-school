import TileButton from "@/components/TileButton";
import ToggleButton from "@/components/ToggleButton";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import {
  Feather,
  AntDesign,
  SimpleLineIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { Fragment, useCallback, useContext, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "@/components/Button";
import { secureStore } from "@/services/secureStore";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Settings() {
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const toggleTheme = useCallback(
    () => setColorScheme(colorScheme === "dark" ? "light" : "dark"),
    [setColorScheme, colorScheme],
  );

  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <Fragment>
          <Text style={styles.sectionTitle}>الحساب</Text>
          <View style={styles.section}>
            <TileButton
              text="الملف الشخصي"
              icon={({ color }) => (
                <Feather name="user" size={24} color={color} />
              )}
              onPress={() => router.navigate("/profile")}
            />
            <TileButton
              text="الأمان وكلمة المرور"
              icon={({ color }) => (
                <Feather name="lock" size={24} color={color} />
              )}
              onPress={() =>
                Toast.show({
                  type: "info",
                  text1: "لم يتم اضافة هذه الميزة في الوقت الحالي",
                  text2: "سيتم اضافة هذه الميزة في اسرع وقت",
                })
              }
            />
          </View>
        </Fragment>
        <Fragment>
          <Text style={styles.sectionTitle}>تفضيلات التطبيق</Text>
          <View style={styles.section}>
            <ToggleButton
              text="الوضع الليلي"
              icon={({ color }) => (
                <Feather name="moon" size={24} color={color} />
              )}
              state={colorScheme === "dark"}
              onPress={toggleTheme}
            />
          </View>
        </Fragment>
        <Fragment>
          <Text style={styles.sectionTitle}>المساعدة والدعم</Text>
          <View style={styles.section}>
            <TileButton
              text="مركز المساعدة"
              icon={({ color }) => (
                <SimpleLineIcons name="question" size={24} color={color} />
              )}
              onPress={() =>
                Toast.show({
                  type: "info",
                  text1: "لم يتم اضافة هذه الميزة في الوقت الحالي",
                  text2: "سيتم اضافة هذه الميزة في اسرع وقت",
                })
              }
            />
            <TileButton
              text="عن التطبيق"
              icon={({ color }) => (
                <AntDesign name="exclamation-circle" size={24} color={color} />
              )}
              onPress={() =>
                Toast.show({
                  type: "info",
                  text1: "لم يتم اضافة هذه الميزة في الوقت الحالي",
                  text2: "سيتم اضافة هذه الميزة في اسرع وقت",
                })
              }
            />
          </View>
        </Fragment>
        <Button
          text="تسجيل الخروج"
          style={styles.button}
          onPressEvent={() => {
            router.dismissAll();
            secureStore.clear();
            router.replace("/login");
          }}
          prefixIcon={<MaterialIcons name="logout" size={24} color="#DC2626" />}
        />
        <Text style={{ color: theme.title, textAlign: "center" }}>
          {`اصدار البرنامج: ${process.env.EXPO_PUBLIC_VERSION}`}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    content: {
      flexGrow: 1,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      paddingHorizontal: 4,
      paddingVertical: 6,
      fontFamily: fonts.bold,
      fontSize: 14,
      color: theme.settings.section.title,
    },
    section: {
      backgroundColor: theme.settings.section.background,
      borderRadius: 10,
    },
    button: {
      backgroundColor: theme.settings.button,
      color: "#DC2626",
    },
  });
}
