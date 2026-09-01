import { Image, StyleSheet, Text, View } from "react-native";

export default function AppSplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.glow} />
      <View style={styles.card}>
        <Image
          source={require("../assets/images/splash-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>مدرسة ماربولس لاعداد خدام</Text>
        <Text style={styles.subtitle}>اعداد خادم سوي ومثقف</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#140B2D",
    paddingHorizontal: 24,
  },
  glow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(167, 30, 52, 0.18)",
    shadowColor: "#A71E34",
    shadowOpacity: 0.6,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 28,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(6px)",
  },
  logo: {
    width: 128,
    height: 128,
    borderRadius: 32,
    marginBottom: 18,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.4,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    color: "#C4B5FD",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    textAlign: "center",
  },
});
