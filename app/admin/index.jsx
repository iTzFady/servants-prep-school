import IconButton from "@/components/IconButton";
import { ThemeContext } from "@/context/ThemeContext";
import { AdmindashboardTabs } from "@/data/tabs";
import { fonts } from "@/theme/fonts";
import { useAppSelector } from "@/store/hooks";
import { router } from "expo-router";
import { useCallback, useContext, useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminIndex() {
  const { theme } = useContext(ThemeContext);
  const user = useAppSelector((state) => state.auth.user);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const defaultProfilePic = require("@/assets/images/default-profile.webp");

  const renderTabs = useCallback(({ item }) => {
    return (
      <IconButton
        key={item.id}
        title={item.label}
        icon={item.icon}
        description={item.description}
        onPress={() => router.navigate(`/${item.value}`)}
        disabled={!item.value}
        onDisabled={() => {
          Toast.show({
            type: "info",
            text1: "لم يتم اضافة هذه الميزة في الوقت الحالي",
            text2: "سيتم اضافة هذه الميزة في اسرع وقت",
          });
        }}
      />
    );
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.studentCard}>
        <Image
          source={user?.pfpUrl ? { uri: user.pfpUrl } : defaultProfilePic}
          style={styles.profilePicture}
        />
        <View>
          <Text style={styles.studentName}>
            {user?.gender === "MALE" ? " باصون " : "تاسوني "} ,
            {user?.name.split(" ")[0] || ""}
          </Text>
          <Text style={styles.cardSubtext}>اهلا بك في مدرسة ماربولس</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>لوحة التحكم</Text>
      <FlatList
        data={AdmindashboardTabs}
        showsVerticalScrollIndicator={false}
        renderItem={renderTabs}
        numColumns={2}
      />
    </SafeAreaView>
  );
}
function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    sectionTitle: {
      borderLeftWidth: 4,
      borderColor: theme.section.color,
      paddingStart: 10,
      fontFamily: fonts.bold,
      fontSize: 18,
      marginVertical: 10,
      color: theme.section.color,
    },
    studentCard: {
      height: 200,
      backgroundColor: theme.card.background,
      flexDirection: "row",
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
