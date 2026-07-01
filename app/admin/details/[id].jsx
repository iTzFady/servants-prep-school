import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useMemo, useContext, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { useUserDetail } from "@/hooks/useUser";
import DetailTile from "@/components/DetailTile";
import dateUtils from "@/utils/dateFormatter";
import { getDayLabel } from "@/data/days";
import { getEducationLabel } from "@/data/education_types";
import { Image } from "expo-image";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorIndicator from "@/components/ErrorIndicator";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserDetails() {
  const { id } = useLocalSearchParams();
  const userId = Array.isArray(id) ? id[0] : id;
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const { data: user, isLoading, error, refetch } = useUserDetail(userId || "");

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (isLoading) return <LoadingIndicator />;

  if (error || !user)
    return (
      <ErrorIndicator state="error" text={error.message} onRetry={onRefresh} />
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.nameContainer}>
          <Image style={styles.pfp} source={user.pfpUrl} />
          <Text numberOfLines={1} ellipsizeMode="clip" style={styles.name}>
            {user.name}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>البيانات الشخصية</Text>
        <View style={styles.row}>
          <DetailTile text="الاسم" subText={user.name} />
          <DetailTile
            text="الجنس"
            subText={user.gender === "MALE" ? "ذكر" : "انثي"}
          />
        </View>
        <View style={styles.row}>
          <DetailTile
            text="تاريخ الميلاد"
            subText={new Date(user.birthdate).toLocaleDateString()}
          />
          <DetailTile text="رقم الهاتف" subText={user.phoneNumber} />
        </View>
        <View style={styles.row}>
          <DetailTile text="الواتساب" subText={user.whatsapp} />
          <DetailTile text="رقم الارضي" subText={user.homeNumber} />
        </View>
        <DetailTile text="المدرسة" subText={user.schoolName} />

        <View style={styles.row}>
          <DetailTile text="سنة التعليم" subText={user.educationYear} />
          <DetailTile
            text="نوع التعليم"
            subText={getEducationLabel(user.educationType)}
          />
        </View>
        <View style={styles.row}>
          <DetailTile
            text="تاريخ التسجيل"
            subText={dateUtils.arabicDate(user.registerDate)}
          />
          <DetailTile text="الخدمة المنتسب لها" subText={user.serviceType} />
        </View>
        <View style={styles.row}>
          <DetailTile
            text="يوم حضور القداس"
            subText={getDayLabel(user.liturgyDate)}
          />
          <DetailTile text="اب الاعتراف" subText={user.confessionFather} />
        </View>
        <DetailTile
          text="السنة الحالية لاعداد خدام"
          subText={user.servantPrepYear === "1" ? "اولي" : "تانية"}
        />
        <DetailTile text="العنوان" subText={user.address} />
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    content: {
      gap: 10,
    },
    row: {
      flexDirection: "row",
      gap: 15,
    },
    name: {
      fontFamily: fonts.bold,
      fontSize: 22,
      color: theme.title,
      textAlign: "center",
    },
    nameContainer: {
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    pfp: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 5,
      borderColor: theme.title,
    },
    sectionTitle: {
      fontFamily: fonts.bold,
      fontSize: 16,
      color: theme.title,
    },
  });
}
