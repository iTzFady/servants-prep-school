import { Text, View, FlatList, StyleSheet } from "react-native";
import { useMemo, useContext, useCallback } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import IconButton from "@/components/IconButton";
import { useRouter } from "expo-router";
import { attendanceTabs } from "@/data/tabs";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AttendanceScreen() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const router = useRouter();
  const renderTabs = useCallback(
    ({ item }) => {
      return (
        <IconButton
          key={item.id}
          title={item.label}
          icon={item.icon}
          description={item.description}
          onPress={() => router.navigate(`/${item.value}`)}
        />
      );
    },
    [router],
  );
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>يمكنك متابعة او تسجيل الحضور</Text>
      <FlatList
        data={attendanceTabs}
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
