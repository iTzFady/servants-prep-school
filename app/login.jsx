import Button from "@/components/Button";
import Divider from "@/components/Divider";
import InputField from "@/components/InputField";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { Feather } from "@expo/vector-icons/";
import { Link, router } from "expo-router";
import { useAppDispatch } from "../store/hooks";
import { setUser, setToken } from "../store/authSlice";
import { useContext, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";

import { SafeAreaView } from "react-native-safe-area-context";
import { useLogin } from "@/hooks/useAuth";
import Toast from "react-native-toast-message";
const logo = require("../assets/images/logo.webp");
export default function Login() {
  const dispatch = useAppDispatch();
  const { mutate: login, isPending } = useLogin();
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      userName: "",
      password: "",
    },
  });
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const onSubmit = (data) => {
    login(
      { ...data, userName: data.userName.trim() },
      {
        onSuccess: (data) => {
          dispatch(setToken(data.token));
          dispatch(setUser(data.userResponse));
          Toast.show({
            type: "success",
            text1: "تم تسجيل الدخول بنجاح",
            text2: "مرحباً بك مجدداً",
          });
          if (data.userResponse.role === "ADMIN") router.replace("/admin");
          else router.replace("/");
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: "خطأ في تسجيل الدخول",
            text2: error.message || "حدث خطأ غير متوقع",
          });
        },
      },
    );
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
                  color={colorScheme === "dark" ? "#ffffff" : "#000"}
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
                  name="userName"
                  rules={{ required: "برجاء كتابة اسم المستخدم" }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      text="اسم المستخدم"
                      prefixIcon={
                        <Feather
                          name="user"
                          size={24}
                          color={theme.inputField.color}
                        />
                      }
                      autoCapitalize="none"
                      autoComplete="username"
                      textContentType="username"
                      autoCorrect={false}
                      inputMode="text"
                      onChangeText={onChange}
                      value={value}
                      placeholder="أدخل اسم المستخدم"
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      error={errors.userName?.message}
                      onBlur={onBlur}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: "برجاء كتابة كلمة المرور",
                    minLength: {
                      value: 6,
                      message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
                    },
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      text="كلمة المرور"
                      autoCapitalize="none"
                      autoComplete="current-password"
                      textContentType="password"
                      autoCorrect={false}
                      inputMode="text"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder="أدخل كلمة المرور"
                      importantForAutofill="yes"
                      passwordRules="minlength: 6;"
                      prefixIcon={
                        <Feather
                          name="lock"
                          size={24}
                          color={theme.inputField.color}
                        />
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
                            color={theme.inputField.color}
                          />
                        </TouchableOpacity>
                      }
                      secureTextEntry={!showPassword}
                      error={errors.password?.message}
                      returnKeyType="done"
                      ref={passwordRef}
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                  )}
                />
              </View>
              <Button
                text="تسجيل الدخول"
                loading={isPending}
                disabled={!isValid || isPending || !isDirty}
                onPressEvent={handleSubmit(onSubmit)}
                prefixIcon={<Feather name="log-in" size={24} color="#ffffff" />}
                style={styles.button}
              />
            </View>
            <Divider separatorWidth="80%" color={theme.login.divider} />
            <View style={styles.linkContainer}>
              <Text style={styles.linkTitle}>ليس لديك حساب؟</Text>
              <Link href="/register" style={styles.link}>
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
      color: theme.login.titleBox.text,
      fontSize: 24,
      textAlign: "center",
      marginVertical: 12,
    },
    subtitleBox: {
      fontFamily: fonts.light,
      color: theme.login.titleBox.text,
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
      color: theme.title,
      fontSize: 14,
      textAlign: "center",
    },
    formBox: {
      padding: 20,
    },
    linkContainer: {
      alignItems: "center",
      padding: 15,
      flexDirection: "row",
      gap: 8,
      marginHorizontal: "auto",
    },
    linkTitle: {
      fontFamily: fonts.regular,
      color: theme.login.link.title,
      fontSize: 14,
    },
    linkText: {
      color: theme.login.link.describtion,
      fontFamily: fonts.bold,
      marginTop: 5,
    },
    button: {
      backgroundColor: theme.login.button,
    },
    toggleButton: {
      borderWidth: 1,
      borderColor: "#384054",
      padding: 10,
      borderRadius: 10,
      backgroundColor: theme.background,
      alignSelf: "flex-start",
    },
  });
}
