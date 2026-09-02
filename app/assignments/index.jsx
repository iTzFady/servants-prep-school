import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useContext, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fonts } from "@/theme/fonts";
import { useAssignments } from "@/hooks/useAssignment";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorIndicator from "@/components/ErrorIndicator";
import { ThemeContext } from "@/context/ThemeContext";

const assignmentsFallback = [];

export default function Assignments() {
  const { data, isLoading, error, refetch } = useAssignments();
  const { theme } = useContext(ThemeContext);
  const assignments = data || assignmentsFallback;

  const dynamic = useMemo(
    () => ({
      background: theme.background,
      headingColor: theme.title,
      chipSelectedBg: theme.chips.selected.background,
      chipSelectedColor: theme.chips.selected.color,
      chipUnSelectedBg: theme.chips.unSelected.background,
      chipUnSelectedColor: theme.chips.unSelected.color,
      cardBackground: theme.secondary,
      cardBorder: theme.borderColor,
      metaText: theme.textSecondary,
      actionColor: theme.primary,
    }),
    [theme],
  );

  const styles = useMemo(() => createStyles(theme), [theme]);
  const [selectedChip, setSelectedChip] = useState("الكل");

  const filtered = useMemo(() => {
    if (!assignments) return [];
    if (selectedChip === "الكل") return assignments;
    return assignments.filter((a) => a.status === selectedChip);
  }, [assignments, selectedChip]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.screen, { backgroundColor: dynamic.background }]}
        edges={["bottom"]}
      >
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.screen, { backgroundColor: dynamic.background }]}
        edges={["bottom"]}
      >
        <ErrorIndicator state="error" text={error.message} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: dynamic.background }]}
      edges={["bottom"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <Chip
            active={selectedChip === "الكل"}
            onPress={() => setSelectedChip("الكل")}
            text="الكل"
            theme={dynamic}
            styles={styles}
          />
          <Chip
            active={selectedChip === "قيد الحل"}
            onPress={() => setSelectedChip("قيد الحل")}
            text="قيد الحل"
            theme={dynamic}
            styles={styles}
          />
          <Chip
            active={selectedChip === "مكتمل"}
            onPress={() => setSelectedChip("مكتمل")}
            text="مكتمل"
            theme={dynamic}
            styles={styles}
          />
          <Chip
            active={selectedChip === "جديد"}
            onPress={() => setSelectedChip("جديد")}
            text="جديد"
            theme={dynamic}
            styles={styles}
          />
        </ScrollView>
        <View style={styles.heading}>
          <View style={styles.mark} />
          <Text style={[styles.headingText, { color: dynamic.headingColor }]}>
            الواجبات الحالية
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/admin/assignments")}
          style={{ alignSelf: "flex-start", marginBottom: 12 }}
        >
          <Text style={{ color: dynamic.actionColor, fontFamily: fonts.bold }}>
            لوحة الإدارة
          </Text>
        </TouchableOpacity>
        {filtered.map((item) => (
          <AssignmentCard
            key={item.id}
            item={item}
            theme={dynamic}
            styles={styles}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Chip({ text, active, theme, styles, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active
            ? theme.chipSelectedBg
            : theme.chipUnSelectedBg,
          borderColor: active ? theme.chipSelectedBg : theme.chipUnSelectedBg,
        },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          {
            color: active ? theme.chipSelectedColor : theme.chipUnSelectedColor,
          },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
function AssignmentCard({ item, theme, styles }) {
  return (
    <TouchableOpacity
      activeOpacity={0.84}
      onPress={() =>
        item.status === "مكتمل"
          ? router.push(`/assignments/result/${item.id}`)
          : router.push(`/assignments/${item.id}`)
      }
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
        <Feather
          name="arrow-left"
          color={item.color || theme.actionColor}
          size={17}
        />
      </View>
    </TouchableOpacity>
  );
}
function createStyles(colors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { paddingBottom: 30 },
    chips: { paddingVertical: 16, paddingHorizontal: 16, gap: 8 },
    chip: {
      height: 36,
      paddingHorizontal: 16,
      borderRadius: 18,
      justifyContent: "center",
      backgroundColor: colors.chips?.unSelected?.background || "#FFF",
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    chipActive: {
      backgroundColor: colors.chips?.selected?.background,
      borderColor: colors.chips?.selected?.background,
    },
    chipText: {
      fontFamily: fonts.medium,
      fontSize: 12,
      color: colors.chips?.unSelected?.color || colors.textSecondary,
    },
    chipTextActive: { color: colors.chips?.selected?.color || "#FFF" },
    heading: {
      height: 40,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    mark: {
      height: 16,
      width: 4,
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
    headingText: { fontFamily: fonts.bold, color: colors.title, fontSize: 16 },
    card: {
      marginHorizontal: 16,
      marginTop: 12,
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.secondary,
      borderWidth: 1,
      borderColor: colors.borderColor,
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
      color: colors.title,
      fontSize: 15,
      textAlign: "right",
    },
    subject: {
      fontFamily: fonts.regular,
      color: colors.textSecondary,
      fontSize: 12,
      textAlign: "right",
      marginTop: 2,
    },
    meta: {
      marginTop: 14,
      paddingTop: 12,
      borderTopWidth: 1,
      borderColor: colors.background,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    metaText: {
      fontFamily: fonts.regular,
      color: colors.textSecondary,
      fontSize: 11,
    },
    action: {
      marginTop: 14,
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
      alignItems: "center",
    },
    actionText: { fontFamily: fonts.bold, color: colors.primary, fontSize: 12 },
  });
}
