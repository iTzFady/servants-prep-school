import Counter from "@/components/Counter";
import Tile from "@/components/Tile";
import { ThemeContext } from "@/context/ThemeContext";
import { useGetProfile } from "@/hooks/useAuth";
import { useAttendance } from "@/hooks/useAttendance";

import { fonts } from "@/theme/fonts";
import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useCallback, useContext, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Image } from "expo-image";

import dateUtils from "@/utils/dateFormatter";
import { getEducationLabel } from "@/data/education_types";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorIndicator from "@/components/ErrorIndicator";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Profile() {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const defaultProfilePic = require("@/assets/images/default-profile.webp");
  const [isModalVisible, setModalVisible] = useState(false);
  const { data: profile, isLoading, error, refetch } = useGetProfile();
  const {
    data: attendance,
    isLoading: isAttendanceLoading,
    error: attendanceError,
    refetch: attendanceReFetch,
  } = useAttendance();

  const presentCount = attendance?.count.present ?? 0;
  const absentCount = attendance?.count.absent ?? 0;
  const isBusy = isLoading || isAttendanceLoading;

  const onRefresh = useCallback(async () => {
    await refetch();
    await attendanceReFetch();
  }, [refetch, attendanceReFetch]);

  if (isBusy) return <LoadingIndicator />;

  if (error || attendanceError)
    return (
      <ErrorIndicator
        state="error"
        text={error?.message || attendanceError?.message}
        onRetry={onRefresh}
      />
    );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isBusy} onRefresh={onRefresh} />
        }
      >
        <View style={styles.dataContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
          >
            <Image
              source={
                profile?.pfpUrl ? { uri: profile?.pfpUrl } : defaultProfilePic
              }
              style={styles.profilePicture}
              contentFit="cover"
            />
          </TouchableOpacity>
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
      <Modal
        visible={isModalVisible}
        transparent
        statusBarTranslucent
        navigationBarTranslucent
        animationType="fade"
      >
        <Pressable
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={
              profile?.pfpUrl ? { uri: profile?.pfpUrl } : defaultProfilePic
            }
            style={styles.fullscreenImage}
            contentFit="contain"
          />
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    content: {
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
      flexDirection: "row",
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
      flexDirection: "row",
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
      flexDirection: "row",
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
    modalContainer: {
      ...StyleSheet.absoluteFill,
      backgroundColor: "rgba(0,0,0,0.9)",
      justifyContent: "center",
      alignItems: "center",
    },
    fullscreenImage: {
      width: "100%",
      height: "100%",
    },
  });
}
