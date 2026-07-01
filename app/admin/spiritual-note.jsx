import { Text, View, FlatList, StyleSheet } from "react-native";
import { useMemo, useContext, useCallback } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import IconButton from "@/components/IconButton";
import { useRouter } from "expo-router";
import { noteTabs } from "@/data/tabs";

export default function SpiritualNote() {
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
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        يمكنك متابعة النوتة او تسجيل الاعتراف
      </Text>
      <FlatList
        data={noteTabs}
        showsVerticalScrollIndicator={false}
        renderItem={renderTabs}
        numColumns={1}
      />
    </View>
  );
}
function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    sectionTitle: {
      borderStartWidth: 4,
      borderColor: theme.section.color,
      paddingStart: 10,
      fontFamily: fonts.bold,
      fontSize: 18,
      marginVertical: 10,
      color: theme.section.color,
    },
  });
}
