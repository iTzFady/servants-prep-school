import { CameraView, useCameraPermissions } from "expo-camera";
import { useCallback, useContext, useMemo } from "react";
import { FontAwesome } from "@expo/vector-icons";

import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { fonts } from "@/theme/fonts";
import { ThemeContext } from "@/context/ThemeContext";
import { useMarkConfession } from "@/hooks/useSpiritualNote";
import { SafeAreaView } from "react-native-safe-area-context";
export default function AttendanceCheck() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const confession = useMarkConfession();

  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);

  const resetState = useCallback(() => undefined, []);

  const submit = useCallback(
    async (id) => {
      try {
        await confession.mutateAsync({
          userId: id,
        });
        Toast.show({
          type: "success",
          text1: "تم تسجيل الاعتراف",
          text2: "تم حفظ الاعتراف بنجاح",
        });

        resetState();

        router.back();
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "فشل تسجيل الاعتراف",
          text2: error.message || "حدث خطأ غير متوقع",
        });

        resetState();

        router.back();
      }
    },
    [confession, resetState, router],
  );

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <TouchableOpacity onPress={requestPermission} style={styles.permission}>
        <FontAwesome name="camera" size={24} color={theme.title} />
        <Text style={styles.permissionText}>برجاء الموافقة علي الكاميرا</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
            confession.isPending
              ? undefined
              : ({ data }) => {
                  submit(data);
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
    </SafeAreaView>
  );
}
function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
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
      flex: 1,
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
  });
}
