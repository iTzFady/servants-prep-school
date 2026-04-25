import IconButton from "@/components/IconButton";
import { ThemeContext } from "@/context/ThemeContext";
import { curriculumTabs } from "@/data/tabs";
import { fonts } from "@/theme/fonts";
import { useCallback, useContext, useMemo } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function Curriculum() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const stpaul = require("@/assets/images/saint-paul.png");

  const renderTabs = useCallback(({ item }) => {
    return (
      <IconButton
        key={item.id}
        title={item.label}
        icon={item.icon}
        description={item.description}
      />
    );
  }, []);
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
      <Text style={styles.sectionTitle}>الفروع</Text>
      <FlatList data={curriculumTabs} renderItem={renderTabs} numColumns={2} />
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
      resizeMode: "contain",
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
  });
}
