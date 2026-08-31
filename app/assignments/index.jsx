import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fonts } from "@/theme/fonts";

const assignments = [
  {
    id: "faith",
    title: "واجب العقيدة",
    subject: "العقيدة المسيحية",
    due: "ينتهي غداً",
    questions: "10 أسئلة",
    status: "قيد الحل",
    color: "#B51D36",
  },
  {
    id: "hymns",
    title: "واجب الألحان",
    subject: "لحن أبؤرو",
    due: "تم التسليم",
    questions: "5 أسئلة",
    status: "مكتمل",
    color: "#16A34A",
  },
  {
    id: "history",
    title: "تاريخ الكنيسة",
    subject: "عصر الشهداء",
    due: "ينتهي الخميس",
    questions: "8 أسئلة",
    status: "جديد",
    color: "#D97706",
  },
];

export default function Assignments() {
  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <Chip active text="الكل" />
          <Chip text="قيد الحل" />
          <Chip text="مكتمل" />
          <Chip text="جديد" />
        </ScrollView>
        <View style={styles.heading}>
          <View style={styles.mark} />
          <Text style={styles.headingText}>الواجبات الحالية</Text>
        </View>
        {assignments.map((item) => (
          <AssignmentCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Chip({ text, active }) {
  return (
    <View style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {text}
      </Text>
    </View>
  );
}
function AssignmentCard({ item }) {
  return (
    <TouchableOpacity
      activeOpacity={0.84}
      onPress={() => router.push(`/assignments/${item.id}`)}
      style={styles.card}
    >
      <View style={[styles.status, { backgroundColor: `${item.color}18` }]}>
        <Text style={[styles.statusText, { color: item.color }]}>
          {item.status}
        </Text>
      </View>
      <View style={styles.cardTop}>
        <View style={[styles.icon, { backgroundColor: `${item.color}16` }]}>
          <Feather name="clipboard" size={21} color={item.color} />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.subject}>{item.subject}</Text>
        </View>
      </View>
      <View style={styles.meta}>
        <Text style={styles.metaText}>
          <Feather name="help-circle" size={14} /> {item.questions}
        </Text>
        <Text style={[styles.metaText, { color: item.color }]}>
          <Feather name="clock" size={14} /> {item.due}
        </Text>
      </View>
      <View style={styles.action}>
        <Text style={styles.actionText}>
          {item.status === "مكتمل" ? "عرض النتيجة" : "ابدأ الحل"}
        </Text>
        <Feather name="arrow-left" color="#B51D36" size={17} />
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { paddingBottom: 30 },
  chips: { paddingVertical: 16, paddingHorizontal: 16, gap: 8 },
  chip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: { backgroundColor: "#B51D36", borderColor: "#B51D36" },
  chipText: { fontFamily: fonts.medium, fontSize: 12, color: "#64748B" },
  chipTextActive: { color: "#FFF" },
  heading: {
    height: 40,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mark: { height: 16, width: 4, borderRadius: 2, backgroundColor: "#B51D36" },
  headingText: { fontFamily: fonts.bold, color: "#1E293B", fontSize: 16 },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  status: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    position: "absolute",
    left: 16,
    top: 16,
  },
  statusText: { fontFamily: fonts.bold, fontSize: 10 },
  cardTop: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingLeft: 80,
  },
  icon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: { flex: 1 },
  cardTitle: {
    fontFamily: fonts.bold,
    color: "#1E293B",
    fontSize: 15,
    textAlign: "right",
  },
  subject: {
    fontFamily: fonts.regular,
    color: "#94A3B8",
    fontSize: 12,
    textAlign: "right",
    marginTop: 2,
  },
  meta: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#F1F5F9",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: { fontFamily: fonts.regular, color: "#64748B", fontSize: 11 },
  action: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    alignItems: "center",
  },
  actionText: { fontFamily: fonts.bold, color: "#B51D36", fontSize: 12 },
});
