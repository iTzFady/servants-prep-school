import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fonts } from "@/theme/fonts";
const albums = [
  {
    id: "meeting",
    title: "لقاء إعداد خدام",
    date: "مايو ٢٠٢٦",
    cover: require("@/assets/images/archive/servants-meeting.webp"),
    count: "١٢ صورة",
  },
  {
    id: "church",
    title: "زيارة الكنيسة",
    date: "أبريل ٢٠٢٦",
    cover: require("@/assets/images/archive/church-visit.webp"),
    count: "٨ صور",
  },
  {
    id: "workshop",
    title: "ورشة الإعلام",
    date: "مارس ٢٠٢٦",
    cover: require("@/assets/images/archive/media-workshop.webp"),
    count: "٦ صور",
  },
  {
    id: "event",
    title: "يوم روحي",
    date: "فبراير ٢٠٢٦",
    cover: require("@/assets/images/archive/stage-event.webp"),
    count: "١٥ صورة",
  },
];
export default function Archive() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => albums.filter((a) => a.title.includes(query)),
    [query],
  );
  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.search}>
          <Feather name="search" size={20} color="#94A3B8" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="ابحث في الأرشيف"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            textAlign="right"
          />
        </View>
        <View style={styles.heading}>
          <View>
            <Text style={styles.title}>ذكرياتنا</Text>
            <Text style={styles.subtitle}>الرحلات واللقاءات والمناسبات</Text>
          </View>
          <Text style={styles.count}>{filtered.length} ألبومات</Text>
        </View>
        <View style={styles.grid}>
          {filtered.map((a) => (
            <TouchableOpacity
              key={a.id}
              onPress={() => router.push(`/archive/${a.id}`)}
              style={styles.card}
            >
              <Image source={a.cover} style={styles.image} contentFit="cover" />
              <View style={styles.cardBody}>
                <Text numberOfLines={1} style={styles.cardTitle}>
                  {a.title}
                </Text>
                <Text style={styles.cardMeta}>
                  {a.date} · {a.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 16, paddingBottom: 30 },
  search: {
    height: 48,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    color: "#1E293B",
    fontSize: 13,
    writingDirection: "rtl",
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginVertical: 22,
  },
  title: { fontFamily: fonts.bold, fontSize: 20, color: "#1E293B" },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  count: { fontFamily: fonts.medium, fontSize: 11, color: "#B51D36" },
  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
  card: {
    width: "47.8%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 7,
    elevation: 1,
  },
  image: { height: 125, width: "100%" },
  cardBody: { padding: 10 },
  cardTitle: {
    fontFamily: fonts.bold,
    color: "#334155",
    fontSize: 13,
    textAlign: "right",
  },
  cardMeta: {
    fontFamily: fonts.regular,
    color: "#94A3B8",
    fontSize: 10,
    textAlign: "right",
    marginTop: 4,
  },
});
