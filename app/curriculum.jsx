import IconButton from "@/components/IconButton";
import { ThemeContext } from "@/context/ThemeContext";
import { curriculumTabs } from "@/data/tabs";
import { fonts } from "@/theme/fonts";
import { useCallback, useContext, useMemo } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function Curriculum() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const defaultProfilePic = require("@/assets/images/saint-paul.png");

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
          <Text style={styles.studentName}>مكتبة الخادم</Text>
          <Text style={styles.cardSubtext}>
            استكشف المناهج التعليمية والمحتوى الروحي
          </Text>
        </View>
        <Image source={defaultProfilePic} style={styles.profilePicture} />
      </View>
      <Text style={styles.sectionTitle}>الفروع</Text>
      <FlatList
        contentContainerStyle={{ alignContent: "center" }}
        data={curriculumTabs}
        renderItem={renderTabs}
        numColumns={2}
      />
    </View>
  );
}
function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
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
      height: 200,
      backgroundColor: theme.card.background,
      flexDirection: "row-reverse",
      alignItems: "center",
      paddingHorizontal: 20,
      gap: 8,
    },
    profilePicture: {
      width: 100,
      height: 180,
      objectFit: "contain",
    },
    textContainer: {
      alignItems: "flex-end",
    },
    studentName: {
      fontFamily: fonts.bold,
      fontSize: 24,
      color: "white",
    },
    cardSubtext: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: "white",
    },
  });
}
