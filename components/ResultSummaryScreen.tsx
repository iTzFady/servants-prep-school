import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#A71E34",
  primaryDark: "#87172A",
  primarySoft: "#F7E9EC",
  text: "#20242A",
  muted: "#737983",
  border: "#E5E7EB",
  background: "#F1F5F9",
  white: "#FFFFFF",
  success: "#2E8B57",
};

type Props = {
  title?: string;
  score: number;
  total: number;
  onDetailsPress?: () => void;
  onBackPress?: () => void;
};

export function ResultSummaryScreen({
  title = "نتيجة الاختبار",
  score,
  total,
  onDetailsPress,
  onBackPress,
}: Props) {
  const percentage = total ? Math.round((score / total) * 100) : 0;
  const isExcellent = percentage >= 85;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBackPress} hitSlop={12}>
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.hero}>
          <View style={styles.medal}>
            <Text style={styles.medalText}>★</Text>
          </View>

          <Text style={styles.congrats}>
            {isExcellent ? "أحسنت!" : "تم الانتهاء من الاختبار"}
          </Text>

          <Text style={styles.heroSubtitle}>هذه هي نتيجتك النهائية</Text>

          <View style={styles.scoreCircle}>
            <Text style={styles.percent}>{percentage}%</Text>
            <Text style={styles.scoreCaption}>
              {score} من {total}
            </Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <Stat label="الإجابات الصحيحة" value={String(score)} />
          <Stat
            label="الإجابات الخاطئة"
            value={String(Math.max(total - score, 0))}
          />
          <Stat label="النسبة" value={`${percentage}%`} />
        </View>

        <Pressable style={styles.primaryButton} onPress={onDetailsPress}>
          <Text style={styles.primaryButtonText}>عرض التفاصيل</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    height: 56,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  headerSpacer: {
    width: 24,
  },
  back: {
    color: COLORS.primary,
    fontSize: 34,
    lineHeight: 34,
    transform: [{ rotate: "180deg" }],
  },
  hero: {
    alignItems: "center",
    paddingTop: 14,
  },
  medal: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  medalText: {
    color: COLORS.white,
    fontSize: 36,
  },
  congrats: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 5,
  },
  scoreCircle: {
    width: 156,
    height: 156,
    borderRadius: 78,
    backgroundColor: COLORS.white,
    borderWidth: 10,
    borderColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  percent: {
    color: COLORS.primary,
    fontSize: 34,
    fontWeight: "900",
  },
  scoreCaption: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 3,
  },
  statsCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 22,
    flexDirection: "row-reverse",
  },
  stat: {
    flex: 1,
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
  },
  primaryButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
  },
});
