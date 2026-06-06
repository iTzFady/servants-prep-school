import Button from "@/components/Button";
import Dropdown from "@/components/CustomDropdown";
import InputField from "@/components/InputField";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useContext, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
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
import { useRegister } from "@/hooks/useApi";
import UploadButton from "@/components/UploadButton";
import { educationTypes, serverntPrepYear } from "@/data/education_types";
import { gender } from "@/data/gender";
import { SafeAreaView } from "react-native-safe-area-context";
import dateUtils from "@/utils/dateFormatter";

export default function Register() {
  const { theme } = useContext(ThemeContext);
  const { mutate: register, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      userName: "",
      password: "",
      confirmPassword: "",
      name: "",
      gender: "",
      birthdate: new Date(),
      address: "",
      whatsapp: "",
      phoneNumber: "",
      homeNumber: "",
      schoolName: "",
      educationType: "",
      educationYear: "",
      confessionFather: "",
      liturgyDate: "",
      servantPrepYear: "",
      serviceType: "",
    },
  });
  const onSubmit = (data) => {
    const payload = { ...data };
    if (payload.password !== payload.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "خطأ في كلمة المرور",
        text2: "يرجى التأكد من أن كلمة المرور وتأكيدها متطابقتان.",
      });
      return;
    }
    const formData = new FormData();
    formData.append("userName", payload.userName);
    formData.append("password", payload.password);
    formData.append("name", payload.name);
    formData.append("gender", payload.gender);
    formData.append("birthdate", dateUtils.dateOnly(payload.birthdate));
    formData.append("address", payload.address);
    formData.append("whatsapp", payload.whatsapp);
    formData.append("phoneNumber", payload.phoneNumber);
    formData.append("homeNumber", payload.homeNumber);
    formData.append("schoolName", payload.schoolName);
    formData.append("educationType", payload.educationType);
    formData.append("educationYear", payload.educationYear);
    formData.append("confessionFather", payload.confessionFather);
    formData.append("liturgyDate", payload.liturgyDate);
    formData.append("servantPrepYear", payload.servantPrepYear);
    formData.append("serviceType", payload.serviceType);
    formData.append("pfp", payload.pfp);
    register(formData, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "تم تسجيل استمارتك بنجاح",
          text2: "تم التسجيل بنجاح وسيتم التواصل معك في حالة قبولك",
        });
        router.replace("/login");
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: "خطأ في تسجيل استمارتك",
          text2: error.message || "حدث خطأ غير متوقع",
        });
      },
    });
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
                name="pfp"
                rules={{ required: "برجاء اضافة صورة شخصية" }}
                render={({ field: { onChange, value } }) => (
                  <UploadButton onChange={onChange} value={value} />
                )}
              />
              <Controller
                control={control}
                name="userName"
                rules={{
                  required: "اسم المستخدم مطلوب",
                  pattern: {
                    value: /^[a-zA-Z0-9_-]+$/,
                    message:
                      "اسم المستخدم يجب أن يحتوي على أحرف إنجليزية فقط و بدون مسافات",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    text="اسم المستخدم"
                    placeholder="أدخل اسم المستخدم"
                    autoCapitalize="none"
                    autoComplete="username"
                    autoCorrect={false}
                    inputMode="text"
                    onChangeText={(text) => {
                      const cleaned = text.replace(/[^a-zA-Z0-9_-]/g, "");
                      onChange(cleaned);
                    }}
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
                rules={{
                  required: "برجاء كتابة كلمة المرور",
                  minLength: {
                    value: 6,
                    message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
                  },
                }}
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
                          color={theme.inputField.color}
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
                    placeholder="أدخل كلمة المرور مرة اخري"
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
                name="confessionFather"
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
                name="liturgyDate"
                rules={{ required: "برجاء اختيار يوم حضورك للقداس" }}
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    dropdownLabel="يوم حضور القداس"
                    data={days}
                    placeHolder="اختر اليوم"
                    onChange={(item) => onChange(item.value)}
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
                    data={educationTypes}
                    placeHolder="اختر نوع الدراسة"
                    onChange={(item) => onChange(item.value)}
                    value={value}
                  />
                )}
              />
              <Controller
                control={control}
                name="schoolName"
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
                name="serviceType"
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
              <Controller
                control={control}
                name="servantPrepYear"
                rules={{ required: "برجاء اختيار نوع دراستك" }}
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    dropdownLabel="سنة دراستك في اعداد خدام"
                    data={serverntPrepYear}
                    placeHolder="اختر سنة دراستك في اعداد خدام"
                    onChange={(item) => onChange(item.value)}
                    value={value}
                  />
                )}
              />

              <Text style={styles.sectionTitle}>بيانات الاتصال</Text>
              <Controller
                control={control}
                name="phoneNumber"
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
                name="homeNumber"
                rules={{
                  required: "برجاء كتابة رقم التليفون الأرضي",
                }}
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
              loading={isPending}
              style={styles.button}
              onPressEvent={handleSubmit(onSubmit, (errors) => {
                const firstError = Object.values(errors)[0];
                if (firstError) {
                  Toast.show({
                    type: "error",
                    text1: "خطأ في تسجيل الاستمارة",
                    text2: firstError.message || "حدث خطأ غير متوقع",
                  });
                }
              })}
              prefixIcon={<Feather name="send" size={24} color="white" />}
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
      borderRightColor: theme.register.text,
      textAlign: "right",
      paddingRight: 10,
      fontFamily: fonts.bold,
      fontSize: 18,
      marginVertical: 10,
      color: theme.register.text,
    },
    title: {
      fontFamily: fonts.bold,
      color: theme.register.text,
      fontSize: 24,
      textAlign: "center",
      marginVertical: 6,
    },
    subtitle: {
      fontFamily: fonts.regular,
      color: theme.register.text,
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
      borderColor: theme.inputField.borderColor,
      backgroundColor: theme.inputField.background,
    },
    dateTimeText: {
      fontSize: 16,
      fontFamily: fonts.medium,
      marginRight: 10,
      color: theme.inputField.color,
    },
    dateFieldLabel: {
      fontFamily: fonts.medium,
      fontSize: 14,
      marginVertical: 5,
      width: "100%",
      textAlign: "right",
      color: theme.dropdown.label,
    },
    buttonContainer: {
      paddingHorizontal: 20,
      backgroundColor: theme.background,
    },
    button: {
      backgroundColor: theme.register.button,
    },
  });
}
