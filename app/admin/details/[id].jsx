import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { useMemo, useContext } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { useUserDetail, useUpdateUserStatus } from "@/hooks/useApi";
import Button from "@/components/Button";
import Toast from "react-native-toast-message";
import DetailTile from "@/components/DetailTile";
import dateUtils from "@/utils/dateFormatter";
import { getDayLabel } from "@/data/days";
import { getEducationLabel } from "@/data/education_types";
export default function UserDetails() {
  const { id } = useLocalSearchParams();
  const userId = Array.isArray(id) ? id[0] : id;
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const router = useRouter();
  const { data: user, isLoading, isError } = useUserDetail(userId || "");

  const { mutate: updateStatus, isPending } = useUpdateUserStatus(userId || "");

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.section.color} />
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          حدث خطأ أثناء تحميل بيانات المستخدم.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.nameContainer}>
        <Image style={styles.pfp} src={user.pfpUrl} />
        <Text style={styles.name}>{user.name}</Text>
      </View>

      <View style={styles.detailsCard}>
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
      </View>
    </ScrollView>
  );
}

const createStyles = (theme, fonts) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: 16,
      paddingBottom: 40,
    },
    detailsCard: {
      gap: 10,
    },
    row: {
      flexDirection: "row-reverse",
      gap: 15,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    name: {
      fontFamily: fonts.bold,
      fontSize: 22,
      color: theme.title,
      textAlign: "right",
    },
    nameContainer: {
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    subtitle: {
      fontFamily: fonts.regular,
      fontSize: 14,
      marginTop: 6,
      color: theme.textSecondary,
      textAlign: "right",
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
      textAlign: "right",
      marginBottom: 14,
    },
    buttonRow: {
      flexDirection: "row",
      marginTop: 24,
      gap: 16,
      backgroundColor: theme.background,
    },
    errorText: {
      color: theme.section.color,
      fontFamily: fonts.regular,
      fontSize: 14,
      textAlign: "center",
    },
  });
