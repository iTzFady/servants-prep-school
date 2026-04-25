import IconButton from "@/components/IconButton";
import { ThemeContext } from "@/context/ThemeContext";
import { dashboardTabs } from "@/data/tabs";
import { fonts } from "@/theme/fonts";
import { router } from "expo-router";
import { useCallback, useContext, useMemo } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const defaultProfilePic = require("@/assets/images/default-profile.png");

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
    <View style={styles.container}>
      <View style={styles.studentCard}>
        <Image source={defaultProfilePic} style={styles.profilePicture} />
        <View style={styles.textContainer}>
          <Text style={styles.studentName}>ابننا الغالي, يوحنا</Text>
          <Text style={styles.cardSubtext}>اهلا بك في مدرسة ماربولس</Text>
          <Text style={styles.cardSubtext}>المستوي الاول</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>لوحة التحكم</Text>
      <FlatList
        data={dashboardTabs}
        showsVerticalScrollIndicator={false}
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
    studentCard: {
      height: 200,
      backgroundColor: theme.card.background,
      flexDirection: "row-reverse",
      alignItems: "center",
      paddingHorizontal: 20,
      gap: 20,
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderColor: theme.card.imageBorder,
      borderWidth: 5,
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
