import Button from "@/components/Button";
import Dropdown from "@/components/CustomDropdown";
import InputField from "@/components/InputField";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { days } from "../data/days";

import { gender } from "@/data/gender";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [value, onChange] = useState(new Date());
  const styles = createStyles(theme, fonts);

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
              <InputField text="اسم المستخدم" placeholder="أدخل اسم المستخدم" />
              <InputField text="الاسم رباعي" placeholder="أدخل اسمك الكامل" />
              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateFieldLabel}>تاريخ الميلاد</Text>
                <View style={styles.dateTimeContainer}>
                  {Platform.OS === "web" ? (
                    <input
                      type="date"
                      value={value?.toString().split("T")[0] || ""}
                      onChange={(e) => onChange(e.target.value)}
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        width: "100%",
                      }}
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
                          onChange={(event, selectedDate) => {
                            setShowDate(false);
                          }}
                        />
                      )}
                    </>
                  )}
                </View>
              </View>
              <Dropdown
                dropdownLabel="النوع"
                data={gender}
                placeHolder="اختر النوع"
                onChange={() => {}}
              />
              <InputField
                text="العنوان بالتفصيل"
                placeholder="المنطقة، الشارع، رقم العقار"
              />
              <InputField text="أب الاعتراف" placeholder="اسم اب الاعتراف" />
              <Dropdown
                dropdownLabel="يوم حضور القداس"
                data={days}
                placeHolder="اختر اليوم"
                onChange={() => {}}
              />
              <Text style={styles.sectionTitle}>التعليم والخدمة</Text>
              <InputField
                text="السنة الدراسية"
                placeholder="مثال: ثالثة هندسة / ثانية ثانوي"
              />
              <Dropdown
                dropdownLabel="نوع الدراسة"
                data={days}
                placeHolder="اختر نوع الدراسة"
                onChange={() => {}}
              />
              <InputField
                text="المدرسة / الكلية"
                placeholder="اسم المؤسسة التعليمية"
              />
              <InputField
                text="مشترك بخدمة"
                placeholder="مثال: ثانوي بنين / شباب وشابات"
              />
              <Dropdown
                dropdownLabel="السنة الحالية بإعداد خدام"
                data={days}
                placeHolder="اختر السنة"
                onChange={() => {}}
              />
              <Text style={styles.sectionTitle}>بيانات الاتصال</Text>
              <InputField text="رقم الموبايل" placeholder="01xxxxxxxxx" />
              <InputField
                text="رقم الواتساب"
                placeholder="رقم الواتساب الفعال"
              />
              <InputField
                text="رقم الواتساب الفعال"
                placeholder="رقم التليفون المنزلي"
              />
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button
              text="ارسال الطلب"
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
