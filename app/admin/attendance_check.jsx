import { CameraView, useCameraPermissions } from "expo-camera";
import { useContext, useMemo, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { useMarkAttendance } from "@/hooks/useAttendance";
import { fonts } from "@/theme/fonts";
import { ThemeContext } from "@/context/ThemeContext";
export default function AttendanceCheck() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const [studentId, setStudentId] = useState("");

  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [locked, setLocked] = useState(false);

  const attendance = useMarkAttendance();

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <TouchableOpacity onPress={requestPermission} style={styles.permission}>
        <FontAwesome name="camera" size={24} color={theme.title} />
        <Text style={styles.permissionText}>برجاء الموافقة علي الكاميرا</Text>
      </TouchableOpacity>
    );
  }

  function resetState() {
    setModalVisible(false);
    setStudentId("");
    setStatus("");
    setNote("");
    setLocked(false);
  }

  async function submit(selectedStatus = status) {
    try {
      await attendance.mutateAsync({
        id: studentId,
        status: selectedStatus,
        note: selectedStatus === "PRESENT" ? "" : note,
      });

      Toast.show({
        type: "success",
        text1: "تم تسجيل الحضور",
        text2: "تم حفظ حالة الطالب بنجاح",
      });

      resetState();

      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "فشل تسجيل الحضور",
        text2: error.message || "حدث خطأ غير متوقع",
      });

      resetState();

      router.back();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>امسح رمز QR</Text>
      <Text style={styles.description}>
        يرجى توجيه الكاميرا نحو الرمز الموجود في هاتف المخدوم
      </Text>
      <View style={styles.scannerContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={
            locked || attendance.isPending
              ? undefined
              : ({ data }) => {
                  setLocked(true);
                  setStudentId(data);
                  setModalVisible(true);
                }
          }
        />

        <View style={styles.overlay}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>
      </View>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlayModal}>
          <View style={styles.card}>
            <Text style={styles.titleModal}>
              برجاء الاختيار حالة حضور الطالب
            </Text>

            <TouchableOpacity
              disabled={attendance.isPending}
              style={[styles.button, attendance.isPending && styles.disabled]}
              onPress={() => submit("PRESENT")}
            >
              <Text style={styles.buttonText}>حاضر</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={attendance.isPending}
              style={[styles.button, attendance.isPending && styles.disabled]}
              onPress={() => setStatus("EXCUSEDLATE")}
            >
              <Text style={styles.buttonText}>تأخير بعذر مقبول</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={attendance.isPending}
              style={[styles.button, attendance.isPending && styles.disabled]}
              onPress={() => setStatus("UNEXCUSEDLATE")}
            >
              <Text style={styles.buttonText}>تأخير بعذر غير مقبول</Text>
            </TouchableOpacity>

            {(status === "EXCUSEDLATE" || status === "UNEXCUSEDLATE") && (
              <>
                <TextInput
                  placeholder="ملاحظة"
                  value={note}
                  editable={!attendance.isPending}
                  onChangeText={setNote}
                  style={styles.input}
                />

                <TouchableOpacity
                  disabled={attendance.isPending}
                  style={[
                    styles.submit,
                    attendance.isPending && styles.disabled,
                  ]}
                  onPress={() => submit()}
                >
                  {attendance.isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={{ color: "white", fontFamily: fonts.medium }}>
                      ارسال
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop: 80,
    },

    title: {
      fontSize: 28,
      fontFamily: fonts.medium,
      color: theme.title,
    },
    description: {
      fontSize: 16,
      fontFamily: fonts.light,
      color: theme.title,
      marginBottom: 40,
      textAlign: "center",
    },
    disabled: {
      opacity: 0.5,
    },
    scannerContainer: {
      width: 300,
      height: 300,
      borderRadius: 24,
      overflow: "hidden",
      position: "relative",
      backgroundColor: "#DDD",
    },

    camera: {
      width: "100%",
      height: "100%",
    },

    overlay: {
      ...StyleSheet.absoluteFillObject,
      pointerEvents: "none",
    },

    permission: {
      ...StyleSheet.absoluteFillObject,
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
    },
    permissionText: {
      fontFamily: fonts.light,
      color: theme.title,
    },

    cornerTopLeft: {
      position: "absolute",
      top: 25,
      left: 25,
      width: 40,
      height: 40,
      borderTopWidth: 4,
      borderLeftWidth: 4,
      borderColor: "#D4B100",
    },

    cornerTopRight: {
      position: "absolute",
      top: 25,
      right: 25,
      width: 40,
      height: 40,
      borderTopWidth: 4,
      borderRightWidth: 4,
      borderColor: "#D4B100",
    },

    cornerBottomLeft: {
      position: "absolute",
      bottom: 25,
      left: 25,
      width: 40,
      height: 40,
      borderBottomWidth: 4,
      borderLeftWidth: 4,
      borderColor: "#D4B100",
    },

    cornerBottomRight: {
      position: "absolute",
      bottom: 25,
      right: 25,
      width: 40,
      height: 40,
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderColor: "#D4B100",
    },
    overlayModal: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,.5)",
      justifyContent: "flex-end",
    },

    card: {
      backgroundColor: "white",
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      gap: 12,
    },

    titleModal: {
      fontSize: 22,
      fontFamily: fonts.regular,
      textAlign: "right",
    },

    button: {
      backgroundColor: "#EEE",
      padding: 16,
      borderRadius: 12,
    },

    input: {
      borderWidth: 1,
      borderColor: "#DDD",
      borderRadius: 12,
      padding: 12,
      textAlign: "right",
      fontFamily: fonts.light,
    },
    buttonText: {
      fontFamily: fonts.medium,
      textAlign: "right",
    },

    submit: {
      backgroundColor: "#2E248D",
      padding: 14,
      borderRadius: 12,
      alignItems: "center",
    },
  });
}
