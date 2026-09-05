import React, { useCallback, useContext, useMemo } from "react";
import { assignmentTabs } from "@/data/tabs";

import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, StyleSheet, Text } from "react-native";
import { fonts } from "@/theme/fonts";
import { ThemeContext } from "@/context/ThemeContext";
import { router } from "expo-router";
import IconButton from "@/components/IconButton";

export default function AdminAssignmentsIndex() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);

  const renderTabs = useCallback(({ item }) => {
    return (
      <IconButton
        key={item.id}
        title={item.label}
        icon={item.icon}
        description={item.description}
        onPress={() => router.navigate(`/${item.value}`)}
      />
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>يمكنك متابعة او انشاء واجبات</Text>
      <FlatList
        data={assignmentTabs}
        showsVerticalScrollIndicator={false}
        renderItem={renderTabs}
        numColumns={1}
      />
    </SafeAreaView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      borderStartWidth: 4,
      borderColor: theme.section.color,
      paddingStart: 10,
      fontFamily: fonts.bold,
      fontSize: 18,
      color: theme.section.color,
    },
  });
}
