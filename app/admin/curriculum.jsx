import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import { ThemeContext } from "@/context/ThemeContext";
import { curriculumTabs } from "@/data/tabs";
import { fonts } from "@/theme/fonts";
import { router } from "expo-router";
import { useCallback, useContext, useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

import { Feather } from "@expo/vector-icons";
export default function AdminCurriculum() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const stpaul = require("@/assets/images/saint-paul.webp");

  const handlePress = useCallback((id) => {
    router.push({
      pathname: `/curriculum/${id}`,
    });
  }, []);

  const renderTabs = useCallback(
    ({ item }) => {
      return (
        <IconButton
          key={item.id}
          title={item.label}
          icon={item.icon}
          description={item.description}
          onPress={() => handlePress(item.value)}
        />
      );
    },
    [handlePress],
  );
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>مكتبة الخادم</Text>
          <Text style={styles.description}>
            استكشف المناهج التعليمية والمحتوى الروحي
          </Text>
        </View>
        <Image source={stpaul} style={styles.stpaulImg} />
      </View>
      <Button
        text="اضافة محاضرة جديدة"
        onPressEvent={() => router.push("/admin/newLecture")}
        prefixIcon={<Feather name="upload-cloud" size={24} color="#ffffff" />}
        style={styles.button}
      />
      <Text style={styles.sectionTitle}>الفروع</Text>
      <FlatList
        data={curriculumTabs}
        renderItem={renderTabs}
        numColumns={2}
        showsVerticalScrollIndicator={false}
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
      borderRightWidth: 4,
      borderRightColor: theme.section.color,
      textAlign: "right",
      paddingRight: 10,
      fontFamily: fonts.bold,
      fontSize: 18,
      marginVertical: 10,
      color: theme.section.color,
    },
    card: {
      alignContent: "space-between",
      width: "100%",
      alignItems: "center",
      backgroundColor: theme.card.background,
      flexDirection: "row-reverse",
      padding: 20,
      gap: 8,
    },
    stpaulImg: {
      width: 80,
      height: 190,
      contentFit: "contain",
    },
    textContainer: {
      flex: 1,
      alignItems: "flex-end",
    },
    title: {
      fontFamily: fonts.bold,
      fontSize: 24,
      color: "white",
    },
    description: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: "white",
      textAlign: "right",
    },
    button: {
      backgroundColor: theme.admin.button,
    },
  });
}
