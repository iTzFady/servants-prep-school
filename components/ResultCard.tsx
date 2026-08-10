import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ResultItem } from "./ResultsTypes";

const COLORS = {
  primary: "#A71E34",
  primarySoft: "#F7E9EC",
  text: "#20242A",
  muted: "#737983",
  border: "#E5E7EB",
  surface: "#FFFFFF",
  background: "#F1F5F9",
  success: "#2E8B57",
  warning: "#D99100",
};

function getStatus(score: number, total: number) {
  const percentage = total ? (score / total) * 100 : 0;
  if (percentage >= 85) return { label: "ممتاز", color: COLORS.success };
  if (percentage >= 60) return { label: "جيد", color: COLORS.primary };
  return { label: "يحتاج مراجعة", color: COLORS.warning };
}

type Props = {
  result: ResultItem;
  onPress?: (result: ResultItem) => void;
};

export function ResultCard({ result, onPress }: Props) {
  const status = getStatus(result.score, result.total);
  const percentage = result.total
    ? Math.round((result.score / result.total) * 100)
    : 0;

  return (
    <Pressable
      onPress={() => onPress?.(result)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {result.title}
          </Text>
          {!!result.subtitle && (
            <Text style={styles.subtitle}>{result.subtitle}</Text>
          )}
        </View>

        <View style={styles.scoreBadge}>
          <Text style={styles.score}>{percentage}%</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.metaLabel}>النتيجة</Text>
          <Text style={styles.metaValue}>
            {result.score} / {result.total}
          </Text>
        </View>

        <View style={styles.statusWrap}>
          <View style={[styles.dot, { backgroundColor: status.color }]} />
          <Text style={[styles.status, { color: status.color }]}>
            {result.status ? result.status : status.label}
          </Text>
        </View>
      </View>

      {!!result.date && <Text style={styles.date}>{result.date}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleWrap: {
    flex: 1,
    alignItems: "flex-end",
    marginLeft: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right",
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 5,
    textAlign: "right",
  },
  scoreBadge: {
    minWidth: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  bottomRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaLabel: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: "right",
  },
  metaValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
    textAlign: "right",
  },
  statusWrap: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: "700",
  },
  date: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 12,
    textAlign: "right",
  },
});
