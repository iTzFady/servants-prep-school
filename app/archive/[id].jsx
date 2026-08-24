import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { fonts } from "@/theme/fonts";
const photos = [
  require("@/assets/images/archive/servants-meeting.webp"),
  require("@/assets/images/archive/media-workshop.webp"),
  require("@/assets/images/archive/stage-event.webp"),
  require("@/assets/images/archive/church-visit.webp"),
  require("@/assets/images/archive/lecture-hall.webp"),
  require("@/assets/images/archive/servants-meeting.webp"),
];
export default function AlbumDetail() {
  const { id } = useLocalSearchParams();
  const name =
    id === "church"
      ? "زيارة الكنيسة"
      : id === "workshop"
        ? "ورشة الإعلام"
        : "لقاء إعداد خدام";
  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{name}</Text>
          <Text style={styles.heroSub}>مايو ٢٠٢٦ · خدمة إعداد خدام</Text>
        </View>
        <Text style={styles.sectionTitle}>الصور</Text>
        <View style={styles.grid}>
          {photos.map((source, index) => (
            <Image
              key={index}
              source={source}
              style={styles.image}
              contentFit="cover"
            />
          ))}
        </View>
        <Text style={styles.sectionTitle}>الملفات المرفقة</Text>
        {["ملخص اللقاء.pdf", "جدول البرنامج.pdf"].map((file) => (
          <View key={file} style={styles.file}>
            <View style={styles.pdf}>
              <Feather name="file-text" color="#B51D36" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fileTitle}>{file}</Text>
              <Text style={styles.fileSub}>PDF · تم الرفع في ٢٠ مايو</Text>
            </View>
            <Feather name="download" size={19} color="#64748B" />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { paddingBottom: 28 },
  hero: {
    padding: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  heroTitle: {
    fontFamily: fonts.bold,
    color: "#1E293B",
    fontSize: 19,
    textAlign: "right",
  },
  heroSub: {
    fontFamily: fonts.regular,
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    color: "#334155",
    fontSize: 15,
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 10,
    textAlign: "right",
  },
  grid: {
    paddingHorizontal: 16,
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 6,
  },
  image: { width: "31.9%", height: 108, borderRadius: 8 },
  file: {
    marginHorizontal: 16,
    marginTop: 9,
    padding: 12,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pdf: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#FFF1F2",
    alignItems: "center",
    justifyContent: "center",
  },
  fileTitle: {
    fontFamily: fonts.bold,
    color: "#334155",
    fontSize: 12,
    textAlign: "right",
  },
  fileSub: {
    fontFamily: fonts.regular,
    color: "#94A3B8",
    fontSize: 10,
    textAlign: "right",
    marginTop: 2,
  },
});
