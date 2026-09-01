import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import {
  FlatList,
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
  const { theme } = useContext(ThemeContext);
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => albums.filter((a) => a.title.includes(query)),
    [query],
  );
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);

  const renderAlbum = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() =>
        router.push({
          pathname: `/archive/${item.id}`,
          params: { name: item.title },
        })
      }
      style={styles.card}
    >
      <Image source={item.cover} style={styles.image} contentFit="cover" />
      <View style={styles.cardBody}>
        <Text numberOfLines={1} style={styles.cardTitle}>
          {item.title}
        </Text>
        <Text style={styles.cardMeta}>
          {item.date} · {item.count}
        </Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.screen} edges={["bottom", "top"]}>
      <View style={styles.search}>
        <Feather name="search" size={20} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث في الارشيف"
          placeholderTextColor={theme.inputField.color}
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <View style={styles.heading}>
        <View>
          <Text style={styles.title}>الألبومات</Text>
        </View>
        <Text style={styles.count}>{filtered.length} ألبومات</Text>
      </View>
      <FlatList
        keyExtractor={(item) => item.id}
        data={filtered}
        renderItem={renderAlbum}
        numColumns={2}
        contentContainerStyle={{ gap: 16 }}
      />
    </SafeAreaView>
  );
}
function createStyles(theme, fonts) {
  return StyleSheet.create({
    screen: { flex: 1, paddingHorizontal: 16 },
    search: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: theme.inputField.background,
      borderRadius: 14,
      marginBottom: 16,
      gap: 10,
    },
    searchInput: {
      flex: 1,
      fontFamily: fonts.regular,
      fontSize: 14,
      color: theme.inputField.color,
      padding: 0,
    },
    heading: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    title: { fontFamily: fonts.bold, fontSize: 14, color: theme.title },

    count: {
      fontFamily: fonts.medium,
      fontSize: 11,
      color: theme.textSecondary,
    },
    card: {
      backgroundColor: theme.secondary,
      flex: 1,
      margin: 10,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    image: { height: 125, width: "100%", borderRadius: 10 },
    cardBody: { padding: 10 },
    cardTitle: {
      fontFamily: fonts.bold,
      color: theme.title,
      fontSize: 13,
    },
    cardMeta: {
      fontFamily: fonts.regular,
      color: theme.textSecondary,
      fontSize: 10,
      marginTop: 4,
    },
  });
}
