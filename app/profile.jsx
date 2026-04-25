import Counter from "@/components/Counter";
import Tile from "@/components/Tile";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useContext, useMemo } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
export default function Profile() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const defaultProfilePic = require("@/assets/images/default-profile.png");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dataContainer}>
        <Image source={defaultProfilePic} style={styles.profilePicture} />
        <Text style={styles.name}>يوحنا منيا</Text>
        <View style={styles.tagContainer}>
          <Text style={styles.tag}>مخدوم</Text>
          <Text style={styles.tag}>خدمة ثانوي بنين</Text>
        </View>
        <View style={styles.counterContainer}>
          <Counter counter={24} text="الواجبات المرسلة" />
          <Counter counter={12} text="مرات الحضور" />
          <Counter counter={3} text="مرات الغياب" />
        </View>
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Feather
              name="user"
              size={24}
              color={theme.profile.section.title}
            />
            <Text style={styles.sectionTitle}>البيانات الشخصية</Text>
          </View>
          <View style={styles.sectionContent}>
            <Tile
              icon={({ color }) => (
                <MaterialCommunityIcons
                  name="cake-variant-outline"
                  size={24}
                  color={color}
                />
              )}
              title="تاريخ الميلاد"
              data="١٥ مايو ٢٠١٠ (١٦ عاماً)"
            />
            <Tile
              icon={({ color }) => (
                <MaterialCommunityIcons
                  name="account-group-outline"
                  size={24}
                  color={color}
                />
              )}
              title="المجموعة"
              data="المستوي الاول - بنين"
            />
            <Tile
              icon={({ color }) => (
                <Entypo name="graduation-cap" size={24} color={color} />
              )}
              title="الدراسة / المهنة"
              data="ثانوي عام"
            />
            <Tile
              icon={({ color }) => (
                <Feather name="phone" size={24} color={color} />
              )}
              title="رقم الهاتف"
              data="+20 123 456 7890"
            />
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <FontAwesome5
              name="bible"
              size={24}
              color={theme.profile.section.title}
            />
            <Text style={styles.sectionTitle}>المتابعة الروحية</Text>
          </View>
          <View style={styles.sectionContent}>
            <Tile
              icon={({ color }) => (
                <FontAwesome name="sticky-note-o" size={24} color={color} />
              )}
              title="أب الاعتراف"
              data="القس بيشوي اسحق"
            />
            <Tile
              icon={({ color }) => (
                <Feather name="calendar" size={24} color={color} />
              )}
              title="تاريخ الانضمام للبرنامج"
              data="١ سيبتمبر ٢٠٢٥"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    dataContainer: {
      alignItems: "center",
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderColor: theme.profile.color,
      borderWidth: 5,
    },
    name: {
      fontSize: 24,
      fontFamily: fonts.bold,
      color: theme.profile.color,
    },
    tagContainer: {
      flexDirection: "row-reverse",
      gap: 8,
    },
    tag: {
      backgroundColor: theme.profile.tag.background,
      color: theme.profile.tag.text,
      fontFamily: fonts.medium,
      fontSize: 12,
      textAlign: "center",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 15,
    },
    counterContainer: {
      flexDirection: "row-reverse",
      gap: 12,
      padding: 16,
    },
    section: {
      padding: 16,
      paddingBottom: 16,
      width: "100%",
      gap: 12,
    },
    sectionTitleContainer: {
      flexDirection: "row-reverse",
      gap: 6,
      alignItems: "center",
    },
    sectionTitle: {
      color: theme.profile.section.title,
      fontSize: 16,
      fontFamily: fonts.bold,
    },
    sectionContent: {
      borderRadius: 20,
      backgroundColor: theme.profile.section.background,
    },
  });
}
