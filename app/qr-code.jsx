import { ThemeContext } from "@/context/ThemeContext";
import { useAppSelector } from "@/store/hooks";

import { fonts } from "@/theme/fonts";
import { useContext, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
export default function QrCode() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const user = useAppSelector((state) => state.auth.user);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}> رمز QR</Text>
        <Text style={styles.subTitle}>
          يرجي توجيه الرمز لهاتف الخادم المتواجد في الوقت الحالي
        </Text>
      </View>
      <View style={styles.qrContainer}>
        <QRCode value={String(user?.id)} size={200} />
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      gap: 32,
    },
    textContainer: { gap: 8 },
    title: {
      color: theme.qr.title,
      fontSize: 24,
      fontFamily: fonts.bold,
      textAlign: "center",
    },
    subTitle: {
      color: theme.qr.subTitle,
      fontSize: 16,
      fontFamily: fonts.regular,
      textAlign: "center",
    },
    qrContainer: {
      backgroundColor: "#f0f0f0",
      padding: 25,
      borderRadius: 10,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 2, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
  });
}
