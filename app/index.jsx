import Button from "@/components/Button";
import Divider from "@/components/Divider";
import InputField from "@/components/InputField";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { Feather } from "@expo/vector-icons/";
import { Link } from "expo-router";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const logo = require("../assets/images/logo.png");
export default function Index() {
  const [loading, setLoading] = useState(false);
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const styles = createStyles(theme, fonts);
  const onSubmit = (data) => {
    setLoading(true);
    console.log(data);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.loginBox}>
            <View style={styles.titlebox}>
              <Pressable
                onPress={() =>
                  setColorScheme(colorScheme === "light" ? "dark" : "light")
                }
                style={styles.toggleButton}
              >
                <Feather
                  name={colorScheme === "dark" ? "moon" : "sun"}
                  size={18}
                  color={theme.text}
                />
              </Pressable>
              <View style={styles.appLogoContainer}>
                <View style={styles.appLogo}>
                  <Image source={logo} style={styles.appLogo} />
                </View>
              </View>
              <Text style={styles.textTitleBox}>برنامج إعداد خدام</Text>
              <Text style={styles.subtitleBox}>
                “اما نحن فلنا فكر المسيح “ ( ١كو ٢ :١٦ )
              </Text>
            </View>
            <View style={styles.formBox}>
              <Text style={styles.loginTitle}>تسجيل الدخول</Text>
              <Text style={styles.loginSubtitle}>
                مرحباً بك مجدداً، أدخل بياناتك للمتابعة
              </Text>
              <View style={styles.formContainer}>
                <Controller
                  control={control}
                  name="username"
                  rules={{ required: "برجاء كتابة اسم المستخدم" }}
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      text="اسم المستخدم"
                      autoCapitalize="none"
                      autoComplete="username"
                      autoCorrect="false"
                      inputMode="text"
                      onChangeText={onChange}
                      value={value}
                      placeholder="أدخل اسم المستخدم"
                      prefixIcon={
                        <Feather name="user" size={24} color="black" />
                      }
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="password"
                  rules={{ required: "برجاء كتابة كلمة المرور" }}
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      text="كلمة المرور"
                      autoCapitalize="none"
                      autoComplete="password"
                      autoCorrect="false"
                      inputMode="text"
                      onChangeText={onChange}
                      value={value}
                      placeholder="أدخل كلمة المرور"
                      prefixIcon={
                        <Feather name="lock" size={24} color="black" />
                      }
                      suffixIcon={
                        <TouchableOpacity
                          onPress={() =>
                            setShowPassword((prevState) => !prevState)
                          }
                        >
                          <Feather
                            name={showPassword ? "eye-off" : "eye"}
                            size={24}
                            color={theme.text}
                          />
                        </TouchableOpacity>
                      }
                      secureTextEntry={!showPassword}
                    />
                  )}
                />
              </View>
              <Button
                text="تسجيل الدخول"
                loading={loading}
                onPressEvent={handleSubmit(onSubmit, (errors) => {
                  const firstError = Object.values(errors)[0];
                  if (firstError) {
                    console.log(firstError.message);
                  }
                })}
                prefixIcon={
                  <Feather name="log-in" size={24} color={theme.secondary} />
                }
              />
            </View>
            <Divider separatorWidth="80%" />
            <View style={styles.linkContainer}>
              <Text style={styles.linkTitle}>ليس لديك حساب؟</Text>
              <Link href="/Register" style={styles.link}>
                <Text style={styles.linkText}>إنشاء حساب جديد</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loginBox: {
      backgroundColor: theme.secondary,
      borderRadius: 10,
      width: "90%",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 2, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    appLogoContainer: {
      gap: 5,
      alignItems: "center",
      padding: 15,
    },
    appLogo: {
      backgroundColor: "#ffffff29",
      borderColor: "#ffffff5f",
      borderWidth: 1,
      borderRadius: 40,
      width: 80,
      height: 80,
    },
    titlebox: {
      backgroundColor: "#A71E34",
      padding: 10,
      borderRadius: 5,
    },
    textTitleBox: {
      fontFamily: fonts.bold,
      color: theme.secondary,
      fontSize: 24,
      textAlign: "center",
      marginVertical: 12,
    },
    subtitleBox: {
      fontFamily: fonts.light,
      color: theme.secondary,
      fontSize: 12,
      textAlign: "center",
    },
    loginTitle: {
      fontFamily: fonts.bold,
      color: theme.title,
      fontSize: 24,
      textAlign: "center",
      marginVertical: 6,
    },
    loginSubtitle: {
      fontFamily: fonts.regular,
      fontSize: 14,
      textAlign: "center",
    },
    formBox: {
      padding: 20,
    },
    linkContainer: {
      alignItems: "center",
      padding: 15,
      flexDirection: "row-reverse",
      gap: 8,
      marginHorizontal: "auto",
    },
    linkTitle: {
      fontFamily: fonts.regular,
      color: theme.textSecondary,
      fontSize: 14,
    },
    linkText: {
      color: theme.primary,
      fontFamily: fonts.bold,
      marginTop: 5,
    },
    toggleButton: {
      borderWidth: 1,
      borderColor: "#384054",
      padding: 10,
      borderRadius: 10,
      backgroundColor: theme.background,
      alignSelf: "flex-end",
    },
  });
}
