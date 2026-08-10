import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ResultCard } from "./ResultCard";
import type { ResultItem } from "./ResultsTypes";

const COLORS = {
  primary: "#A71E34",
  text: "#20242A",
  muted: "#737983",
  background: "#F1F5F9",
};

type Props = {
  results: ResultItem[];
  onResultPress?: (result: ResultItem) => void;
};

export function ResultsListScreen({ results, onResultPress }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>النتائج</Text>
        <Text style={styles.headerSubtitle}>
          نتائج الاختبارات والتقييمات السابقة
        </Text>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ResultCard result={item} onPress={onResultPress} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>✓</Text>
            </View>
            <Text style={styles.emptyTitle}>لا توجد نتائج بعد</Text>
            <Text style={styles.emptyText}>
              ستظهر نتائج الاختبارات هنا بعد الانتهاء منها.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18,
    alignItems: "flex-end",
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "right",
  },
  headerSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 6,
    textAlign: "right",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  empty: {
    alignItems: "center",
    paddingTop: 70,
    paddingHorizontal: 35,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F7E9EC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyIconText: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: "800",
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 7,
  },
});
