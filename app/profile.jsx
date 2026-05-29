import Counter from "@/components/Counter";
import Tile from "@/components/Tile";
import { ThemeContext } from "@/context/ThemeContext";
import { useGetProfile, useAttendance } from "@/hooks/useApi";
import { fonts } from "@/theme/fonts";
import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useContext, useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";

import dateUtils from "@/utils/dateFormatter";
import { getEducationLabel } from "@/data/education_types";
export default function Profile() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const defaultProfilePic = require("@/assets/images/default-profile.webp");
  const { data: profile, isLoading, error } = useGetProfile();
  const {
    data: attendance,
    isLoading: isAttendanceLoading,
    error: attendanceError,
  } = useAttendance();

  const presentCount = attendance?.count.present ?? 0;
  const absentCount = attendance?.count.absent ?? 0;
  const isBusy = isLoading || isAttendanceLoading;

  if (isBusy)
    return (
      <ActivityIndicator
        style={{ flex: 1, marginHorizontal: "auto", marginVertical: "auto" }}
        color={theme.title}
      />
    );

  if (error || attendanceError)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialIcons name="error" size={34} color={theme.title} />
        <Text
          style={{
            textAlign: "center",
            color: theme.title,
            fontFamily: fonts.medium,
          }}
        >
          لقد حدث خطأ
        </Text>
      </View>
    );
  return (
    <ScrollView style={styles.container}>
      <View style={styles.dataContainer}>
        <Image
          source={
            profile?.pfpUrl ? { uri: profile?.pfpUrl } : defaultProfilePic
          }
          style={styles.profilePicture}
        />
        <Text style={styles.name}>{profile?.name}</Text>
        <View style={styles.tagContainer}>
          <Text style={styles.tag}>
            {profile?.role === "USER" ? "مخدوم" : "خادم"}
          </Text>
          <Text style={styles.tag}>{profile?.serviceType}</Text>
        </View>
        <View style={styles.counterContainer}>
          <Counter counter={presentCount} text="مرات الحضور" />
          <Counter counter={absentCount} text="مرات الغياب" />
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
              data={dateUtils.arabicDate(profile?.birthdate)}
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
              data={`${profile?.servantPrepYear === "1" ? "المستوي الاول" : "المستوي الثاني"} - ${profile?.gender === "MALE" ? "بنين" : "بنات"}`}
            />
            <Tile
              icon={({ color }) => (
                <Entypo name="graduation-cap" size={24} color={color} />
              )}
              title="الدراسة / المهنة"
              data={getEducationLabel(profile?.educationType)}
            />
            <Tile
              icon={({ color }) => (
                <Feather name="phone" size={24} color={color} />
              )}
              title="رقم الهاتف"
              data={profile?.phoneNumber}
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
              data={profile?.confessionFather}
            />
            <Tile
              icon={({ color }) => (
                <Feather name="calendar" size={24} color={color} />
              )}
              title="تاريخ الانضمام للبرنامج"
              data={dateUtils.arabicDate(profile?.registerDate)}
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
      overflow: "hidden",
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
