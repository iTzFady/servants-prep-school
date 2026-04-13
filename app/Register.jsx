import Button from "@/components/Button";
import Dropdown from "@/components/CustomDropdown";
import InputField from "@/components/InputField";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useContext, useState } from "react";
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
import { days } from "../data/days";

import { gender } from "@/data/gender";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const styles = createStyles(theme, fonts);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      birthdate: new Date(),
      gender: "",
      address: "",
      father: "",
      liturgy: "",
      educationYear: "",
      educationType: "",
      school: "",
      service: "",
      prepYear: "",
      mobile: "",
      whatsapp: "",
      homePhone: "",
    },
  });
  const onSubmit = (data) => {
    setLoading(true);
    console.log(data);
    setLoading(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>طلب التحاق بإعداد الخدام</Text>
            <Text style={styles.subtitle}>
              يرجى ملء كافة البيانات المطلوبة بدقة لنتمكن من مراجعة طلبك.
            </Text>
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>البيانات الشخصية</Text>
              <Controller
                control={control}
                name="username"
                rules={{ required: "اسم المستخدم مطلوب" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    text="اسم المستخدم"
                    placeholder="أدخل اسم المستخدم"
                    autoCapitalize="none"
                    autoComplete="username"
                    autoCorrect="false"
                    inputMode="text"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
              <Controller
                control={control}
                name="name"
                rules={{ required: "الاسم مطلوب" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    text="الاسم رباعي"
                    autoComplete="name"
                    autoCorrect="name"
                    inputMode="text"
                    placeholder="أدخل اسمك الكامل"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
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
                    placeholder="أدخل كلمة المرور"
                    secureTextEntry={!showPassword}
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                rules={{ required: "برجاء تأكيد كلمة المرور" }}
                render={({ field: { onChange, value } }) => (
                  <InputField
                    text="تأكيد كلمة المرور"
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect="false"
                    inputMode="text"
                    onChangeText={onChange}
                    value={value}
                    placeholder="أدخل كلمة المرور مرة اخريقe"
                    secureTextEntry={!showPassword}
                  />
                )}
              />
              <Controller
                control={control}
                name="birthdate"
                rules={{ required: "تاريخ الميلاد مطلوب" }}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.dateTimeContainer}>
                    <Text style={styles.dateFieldLabel}>تاريخ الميلاد</Text>
                    <View style={styles.dateTimeContainer}>
                      {Platform.OS === "web" ? (
                        <input
                          type="date"
                          value={value?.toString().split("T")[0] || ""}
                          onChange={(e) => onChange(e.target.value)}
                        />
                      ) : (
                        <>
                          <Pressable
                            style={styles.dateTimeSelector}
                            onPress={() => setShowDate(true)}
                          >
                            <Text style={styles.dateTimeText}>
                              {value
                                ? `${value.getDate()}/${
                                    value.getMonth() + 1
                                  }/${value.getFullYear()}`
                                : "اختر التاريخ"}
                            </Text>
                          </Pressable>
                          {showDate && (
                            <DateTimePicker
                              mode="date"
                              display="default"
                              value={value}
                              onChange={(event, selectedDate) => {
                                setShowDate(false);
                                if (selectedDate) onChange(selectedDate);
                              }}
                            />
                          )}
                        </>
                      )}
                    </View>
                  </View>
                )}
              />
              <Controller
                control={control}
                name="gender"
                rules={{ required: "برجاء اختيار النوع" }}
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    dropdownLabel="النوع"
                    data={gender}
                    placeHolder="اختر النوع"
                    onChange={(item) => onChange(item.value)}
                    value={value}
                  />
                )}
              />
              <Controller
                control={control}
                name="address"
                rules={{ required: "برجاء كتابة العنوان" }}
                render={({ field: { onChange, value } }) => (
                  <InputField
                    text="العنوان بالتفصيل"
                    autoCapitalize="none"
                    autoComplete="address-line1"
                    autoCorrect="false"
                    inputMode="text"
                    onChangeText={onChange}
                    value={value}
                    placeholder="المنطقة، الشارع، رقم العقار"
                  />
                )}
              />
              <Controller
                control={control}
                name="father"
                rules={{ required: "برجاء كتابة اسم الأب" }}
                render={({ field: { onChange, value } }) => (
                  <InputField
                    text="أب الاعتراف"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="false"
                    onChangeText={onChange}
                    value={value}
                    inputMode="text"
                    placeholder="اسم اب الاعتراف"
                  />
                )}
              />
              <Controller
                control={control}
                name="liturgy"
                rules={{ required: "برجاء اختيار يوم حضورك للقداس" }}
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    dropdownLabel="يوم حضور القداس"
                    data={days}
                    placeHolder="اختر اليوم"
                    onChange={onChange}
                    value={value}
                  />
                )}
              />

              <Text style={styles.sectionTitle}>التعليم والخدمة</Text>
              <Controller
                control={control}
                name="educationYear"
                rules={{ required: "برجاء كتابة سنتك التعليمية" }}
                render={({ field: { onChange, value } }) => (
                  <InputField
                    text="السنة الدراسية"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="false"
                    inputMode="text"
                    placeholder="مثال:خريج / ثانية ثانوي"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              <Controller
                control={control}
                name="educationType"
                rules={{ required: "برجاء اختيار نوع دراستك" }}
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    dropdownLabel="نوع الدراسة"
                    data={days}
                    placeHolder="اختر نوع الدراسة"
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
              <Controller
                control={control}
                name="school"
                rules={{ required: "برجاء كتابة اسم المدرسة أو الكلية" }}
                render={({ field: { onChange, value } }) => (
                  <InputField
                    text="المدرسة / الكلية"
                    placeholder="اسم المؤسسة التعليمية"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="false"
                    inputMode="text"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              <Controller
                control={control}
                name="service"
                rules={{ required: "برجاء كتابة اسم الخدمةالمنتسب لها" }}
                render={({ field: { onChange, value } }) => (
                  <InputField
                    text="مشترك بخدمة"
                    placeholder="مثال: ثانوي بنين / شباب وشابات"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="false"
                    inputMode="text"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />

              <Text style={styles.sectionTitle}>بيانات الاتصال</Text>
              <Controller
                control={control}
                name="mobile"
                rules={{
                  required: "برجاء كتابة رقم الموبايل",
                  pattern: {
                    value: /^01\d{9}$/,
                    message: "رقم الموبايل غير صالح",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <InputField
                    text="رقم الموبايل"
                    placeholder="01xxxxxxxxx"
                    autoCapitalize="none"
                    autoComplete="tel"
                    autoCorrect="false"
                    inputMode="tel"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              <Controller
                control={control}
                name="whatsapp"
                rules={{
                  required: "برجاء كتابة رقم الواتساب",
                  pattern: {
                    value: /^01\d{9}$/,
                    message: "رقم الواتساب غير صالح",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <InputField
                    text="رقم الواتساب"
                    placeholder="رقم الواتساب الفعال"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="false"
                    inputMode="text"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              <Controller
                control={control}
                name="landline"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    text="الرقم الأرضي"
                    placeholder="رقم التليفون المنزلي"
                    autoCapitalize="none"
                    autoComplete="tel"
                    autoCorrect="false"
                    inputMode="tel"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button
              text="ارسال الطلب"
              loading={loading}
              onPressEvent={handleSubmit(onSubmit, (errors) => {
                const firstError = Object.values(errors)[0];
                if (firstError) {
                  console.log(firstError.message);
                }
              })}
              prefixIcon={
                <Feather name="send" size={24} color={theme.secondary} />
              }
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    formContainer: {
      width: "100%",
      paddingHorizontal: 20,
    },
    scrollContent: {
      flexGrow: 1,
    },
    sectionTitle: {
      borderRightWidth: 4,
      borderRightColor: theme.primary,
      textAlign: "right",
      paddingRight: 10,
      fontFamily: fonts.bold,
      fontSize: 18,
      marginVertical: 10,
      color: theme.primary,
    },
    title: {
      fontFamily: fonts.bold,
      color: theme.primary,
      fontSize: 24,
      textAlign: "center",
      marginVertical: 6,
    },
    subtitle: {
      fontFamily: fonts.regular,
      fontSize: 14,
      textAlign: "center",
    },
    dateTimeContainer: {
      width: "100%",
    },
    dateTimeSelector: {
      height: 50,
      flexDirection: "row-reverse",
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.borderColor,
      backgroundColor: "#F8FAFC",
    },
    dateTimeText: {
      fontSize: 20,
      fontFamily: fonts.light,
      marginRight: 10,
    },
    dateFieldLabel: {
      fontFamily: fonts.medium,
      fontSize: 14,
      marginVertical: 5,
      width: "100%",
      textAlign: "right",
      color: theme.textSecondary,
    },
    buttonContainer: {
      paddingHorizontal: 20,
      backgroundColor: theme.background,
    },
  });
}
