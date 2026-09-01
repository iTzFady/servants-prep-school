import { useCallback, useContext, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import InputField from "@/components/InputField";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { useResults } from "@/hooks/useResults";
import { SubjectTabs, getSubjectLabel } from "@/data/subjects";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorIndicator from "@/components/ErrorIndicator";

export default function ResultsPage() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const { data: results, isLoading, error, refetch } = useResults();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  if (isLoading) return <LoadingIndicator />;
  if (error)
    return (
      <ErrorIndicator state="error" text={error.message} onRetry={onRefresh} />
    );
  const renderItems = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconWrapper}>
            {(() => {
              const tab = SubjectTabs.find((t) => t.value === item.subject);
              const IconComp = tab?.icon;
              return IconComp
                ? IconComp({ color: theme.section.color, size: 20 })
                : null;
            })()}
          </View>
          <Text style={styles.subjectLabel}>
            {getSubjectLabel(item.subject)}
          </Text>
        </View>
        <InputField
          text="الدرجة"
          value={item.score?.toString() ?? ""}
          editable={false}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={results.results}
        keyExtractor={(result) => result.subject}
        renderItem={renderItems}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={<ErrorIndicator text="لم يتم اضافة نتائج بعد" />}
        ListHeaderComponent={
          results.results.length > 0 && (
            <Text style={styles.title}>نتائج الطالب</Text>
          )
        }
      />
    </SafeAreaView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    title: {
      color: theme.section.color,
      fontFamily: fonts.bold,
      fontSize: 22,
      marginBottom: 4,
    },
    subtitle: {
      color: theme.textSecondary,
      fontFamily: fonts.regular,
      fontSize: 14,
      marginBottom: 16,
    },
    card: {
      padding: 18,
      borderRadius: 20,
      backgroundColor: theme.secondary,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 16,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    iconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.section.background,
      alignItems: "center",
      justifyContent: "center",
    },
    subjectLabel: {
      color: theme.section.color,
      fontFamily: fonts.bold,
      fontSize: 16,
      marginBottom: 12,
    },
    separator: {
      height: 12,
    },
    listContent: {
      gap: 16,
      paddingBottom: 24,
    },
  });
}
