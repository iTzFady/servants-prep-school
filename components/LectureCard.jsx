import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { useCallback, useContext, useMemo } from "react";
import dateUtils from "@/utils/dateFormatter";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { Ionicons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

import { useDownload } from "@/hooks/useDownload";
import { useLectureDetail } from "@/hooks/useLectures";

const TYPES = {
  audio: {
    background: "#F0FDF4",
    icon: "mic",
    iconColor: "#16A34A",
    type: "صوت",
  },

  video: {
    background: "#EFF6FF",
    icon: "videocam",
    iconColor: "#2563EB",
    type: "فيديو",
  },

  image: {
    background: "#FEF2F2",
    icon: "image",
    iconColor: "#DC2626",
    type: "صورة",
  },

  document: {
    background: "#F5F3FF",
    icon: "document",
    iconColor: "#7C3AED",
    type: "مستند",
  },
  application: {
    background: "#F5F3FF",
    icon: "document",
    iconColor: "#7C3AED",
    type: "مستند",
  },
};

export default function LectureCard({ typeConfig, item, subject }) {
  const { theme } = useContext(ThemeContext);

  const styles = useMemo(() => createStyles(theme, fonts), [theme]);

  const config = TYPES[item.type];

  const { downloadProgress, downloadLecture, openLecture, downloadedLectures } =
    useDownload();

  const { data: lectureDetail, isLoading: isLoadingUrl } = useLectureDetail(
    subject,
    item.id,
  );

  const isDownloaded = useMemo(() => {
    return downloadedLectures.some((lecture) => lecture.id === item.id);
  }, [downloadedLectures, item.id]);

  const progress = downloadProgress[item.id];

  const isDownloading = progress !== undefined && progress < 100;

  const handleDownload = useCallback(async () => {
    if (!lectureDetail?.lectureUrl) {
      return;
    }

    await downloadLecture(
      item.id,
      lectureDetail.lectureUrl,
      item.title,
      item.type,
    );
  }, [lectureDetail, item.id, item.title, item.type, downloadLecture]);

  const handleOpen = useCallback(async () => {
    await openLecture(item.id);
  }, [item.id, openLecture]);

  const renderLectureIcon = useCallback(() => {
    return (
      <View
        style={[
          styles.lectureLeft,
          {
            backgroundColor: config.background,
          },
        ]}
      >
        <Ionicons name={config.icon} size={24} color={config.iconColor} />
      </View>
    );
  }, [config.background, config.icon, config.iconColor, styles.lectureLeft]);

  const renderActionButton = () => {
    if (isDownloading) {
      return (
        <View style={styles.downloadContainer}>
          <ActivityIndicator size="small" color={config.iconColor} />

          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      );
    }

    if (isDownloaded) {
      return (
        <TouchableOpacity
          onPress={handleOpen}
          style={styles.openButton}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="folder-open"
            size={20}
            color={config.iconColor}
          />
        </TouchableOpacity>
      );
    }

    if (isLoadingUrl) {
      return (
        <View style={styles.downloadContainer}>
          <ActivityIndicator size="small" color={config.iconColor} />
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={handleDownload}
        disabled={!lectureDetail}
        style={styles.downloadButton}
        activeOpacity={0.7}
      >
        <Ionicons name="download" size={20} color={config.iconColor} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.lectureCard}>
      {renderLectureIcon()}

      <View style={styles.lectureMiddle}>
        <Text style={styles.lectureTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.lectureMetaRow}>
          <View style={styles.metaContainer}>
            <Ionicons
              name={config.icon}
              size={12}
              color={theme.LectureCard.color}
            />

            <Text style={styles.lectureMeta}>{typeConfig.label}</Text>
          </View>

          <View style={styles.metaContainer}>
            <Entypo name="calendar" size={12} color={theme.LectureCard.color} />

            <Text style={styles.lectureMeta}>
              {dateUtils.arabicDate(new Date(item.date))}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.lectureRight}>{renderActionButton()}</View>
    </View>
  );
}

function createStyles(theme, fonts) {
  return StyleSheet.create({
    lectureCard: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginHorizontal: 16,
      marginBottom: 8,
      backgroundColor: theme.LectureCard.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.LectureCard.border,
      gap: 12,
    },

    lectureLeft: {
      width: 56,
      height: 56,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
    },

    lectureMiddle: {
      flex: 1,
    },

    lectureTitle: {
      fontFamily: fonts.bold,
      fontSize: 16,
      color: theme.LectureCard.color,
    },

    lectureMetaRow: {
      flexDirection: "row",
      gap: 15,
      marginTop: 4,
    },

    lectureMeta: {
      fontFamily: fonts.regular,
      fontSize: 12,
      color: theme.LectureCard.color,
    },

    lectureRight: {
      minWidth: 50,
      minHeight: 50,
      justifyContent: "center",
      alignItems: "center",
    },

    metaContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },

    downloadButton: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },

    openButton: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },

    downloadContainer: {
      width: 50,
      justifyContent: "center",
      alignItems: "center",
      gap: 4,
    },

    progressText: {
      fontFamily: fonts.regular,
      fontSize: 10,
      color: theme.LectureCard.color,
    },
  });
}
