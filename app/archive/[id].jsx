import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { fonts } from "@/theme/fonts";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useMemo } from "react";
import LectureCard from "@/components/LectureCard";
import { Lecture_Types } from "@/data/lectures";
const photos = [
  require("@/assets/images/archive/servants-meeting.webp"),
  require("@/assets/images/archive/media-workshop.webp"),
  require("@/assets/images/archive/stage-event.webp"),
  require("@/assets/images/archive/church-visit.webp"),
  require("@/assets/images/archive/lecture-hall.webp"),
  require("@/assets/images/archive/servants-meeting.webp"),
];
export default function AlbumDetail() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
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
            </View>
            <Feather name="download" size={19} color="#64748B" />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
function createStyles(theme, fonts) {
  return StyleSheet.create({
    screen: { flex: 1 },
    sectionTitle: {
      fontFamily: fonts.bold,
      color: theme.title,
      fontSize: 15,
      marginHorizontal: 16,
      marginTop: 22,
      marginBottom: 10,
    },
    grid: {
      paddingHorizontal: 16,
      flexDirection: "row-reverse",
      flexWrap: "wrap",
      gap: 6,
    },
    image: { width: "31.9%", height: 108, borderRadius: 8 },
    file: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginHorizontal: 16,
      marginBottom: 8,
      backgroundColor: theme.LectureCard.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.LectureCard.border,
      gap: 12,
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
      color: theme.title,
      fontSize: 12,
    },
  });
}
