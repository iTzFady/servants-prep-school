import {
  View,
  ScrollView,
  Platform,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useContext, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { fonts } from "@/theme/fonts";
import { ThemeContext } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";
import Dropdown from "@/components/CustomDropdown";
import { curriculumTabs } from "@/data/tabs";
import FileUploadButton from "@/components/FileUploadButton";
import { useUploadLecture } from "@/hooks/useLectures";
import { useRouter } from "expo-router";
export default function CreateCurriculum() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const [showDate, setShowDate] = useState(false);
  const { mutate: uploadLecture, isPending } = useUploadLecture();
  const router = useRouter();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      subject: "",
      date: new Date(),
      file: null,
    },
  });

  const onSubmit = (data) => {
    if (!data.file) {
      Toast.show({
        type: "error",
        text1: "خطأ",
        text2: "برجاء اختيار ملف",
      });
      return;
    }

    uploadLecture(
      {
        title: data.name,
        subject: data.subject,
        date: data.date,
        file: data.file,
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "تمت العملية بنجاح",
            text2: "تم رفع المحاضرة بنجاح",
          });
          router.back();
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: "لقد حدث خطا",
            text2: error.message || "فشل رفع المحاضرة",
          });
        },
      },
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="name"
            rules={{ required: "اسم المحاضرة مطلوب" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                text="اسم المحاضرة"
                autoComplete="name"
                autoCorrect={false}
                inputMode="text"
                placeholder="أدخل اسم المحاضرة"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="subject"
            rules={{ required: "برجاء اختيار القسم" }}
            render={({ field: { onChange, value } }) => (
              <Dropdown
                dropdownLabel="القسم"
                data={curriculumTabs}
                placeHolder="اختر القسم"
                onChange={(item) => onChange(item.value)}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="date"
            rules={{ required: "تاريخ المحاضرة مطلوب" }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateFieldLabel}>تاريخ المحاضرة</Text>
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
            name="file"
            rules={{ required: "برجاء اضافة المطلوب رفعه" }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.fileUploadContainer}>
                <Text style={styles.fileUploadLabel}>رفع الملف</Text>
                <View style={styles.fileUploadContainer}>
                  <FileUploadButton
                    value={value}
                    onChange={onChange}
                    accept={["image", "video", "audio", "document"]}
                    disabled={isPending}
                  />
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          text="رفع المحاضرة"
          loading={isPending}
          disabled={isPending}
          style={styles.button}
          onPressEvent={handleSubmit(onSubmit, (errors) => {
            const firstError = Object.values(errors)[0];
            if (firstError) {
              Toast.show({
                type: "error",
                text1: "حدث خطا",
                text2: firstError.message || "حدث خطأ غير متوقع",
              });
            }
          })}
          prefixIcon={<Feather name="upload-cloud" size={24} color="white" />}
        />
      </View>
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
      paddingHorizontal: 16,
      gap: 20,
    },
    scrollContent: {
      flexGrow: 1,
    },
    fileUploadContainer: {
      width: "100%",
    },
    fileUploadLabel: {
      fontFamily: fonts.medium,
      fontSize: 14,
      marginVertical: 5,
      width: "100%",
      color: theme.dropdown.label,
    },
    dateTimeContainer: {
      width: "100%",
    },
    dateTimeSelector: {
      height: 50,
      flexDirection: "row",
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
