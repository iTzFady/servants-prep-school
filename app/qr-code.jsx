import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { useContext, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
export default function QrCode() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}> رمز QR</Text>
        <Text style={styles.subTitle}>
          يرجي توجيه الرمز لهاتف الخادم المتواجد في الوقت الحالي
        </Text>
      </View>
      <QRCode value="123" size={250} />
    </ScrollView>
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
      marginBottom: 75,
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
  });
}
