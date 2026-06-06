import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { Platform, Linking } from "react-native";

// Only import platform-specific modules when not on web
let FileSystem: typeof import("expo-file-system/legacy") | null = null;
let IntentLauncher: typeof import("expo-intent-launcher") | null = null;

if (Platform.OS !== "web") {
  try {
    FileSystem = require("expo-file-system/legacy");
    IntentLauncher = require("expo-intent-launcher");
  } catch (e) {
    console.warn("Platform-specific modules not available");
  }
}

export interface DownloadedLecture {
  id: string;
  title: string;
  type: string;
  path: string;
  extension: string;
}

const STORAGE_KEY = "@downloaded_lectures";
const DOWNLOADS_DIR =
  Platform.OS === "web"
    ? "web-downloads"
    : `${FileSystem?.documentDirectory}lectures/`;

export const useDownload = () => {
  const [downloadProgress, setDownloadProgress] = useState<{
    [key: string]: number;
  }>({});

  const [downloadedLectures, setDownloadedLectures] = useState<
    DownloadedLecture[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  // =========================================
  // HELPERS
  // =========================================

  const ensureDownloadsDirectory = useCallback(async () => {
    if (Platform.OS === "web") {
      return;
    }

    if (!FileSystem) return;

    const dirInfo = await FileSystem.getInfoAsync(DOWNLOADS_DIR);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(DOWNLOADS_DIR, {
        intermediates: true,
      });
    }
  }, []);

  const saveDownloadsToStorage = useCallback(
    async (lectures: DownloadedLecture[]) => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lectures));
      } catch (error) {
        console.error("Failed saving downloads:", error);
      }
    },
    [],
  );

  const getFileExtensionFromUrl = useCallback((url: string): string => {
    try {
      const cleanUrl = url.split("?")[0];

      const extension = cleanUrl.split(".").pop()?.toLowerCase();

      return extension || "bin";
    } catch {
      return "bin";
    }
  }, []);

  const getMimeType = (extension: string) => {
    const mimeTypes: Record<string, string> = {
      mp4: "video/mp4",
      mov: "video/quicktime",

      mp3: "audio/mpeg",
      wav: "audio/wav",

      pdf: "application/pdf",

      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",

      doc: "application/msword",

      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };

    return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
  };

  const getLectureById = useCallback(
    (lectureId: string) => {
      return downloadedLectures.find((lecture) => lecture.id === lectureId);
    },
    [downloadedLectures],
  );

  // =========================================
  // INITIALIZE
  // =========================================

  const initializeDownloads = useCallback(async () => {
    try {
      if (Platform.OS === "web") {
        // On web, just load from AsyncStorage without file validation
        const storedLectures = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedLectures) {
          const parsedLectures: DownloadedLecture[] =
            JSON.parse(storedLectures);
          setDownloadedLectures(parsedLectures);
        }
        return;
      }

      await ensureDownloadsDirectory();

      const storedLectures = await AsyncStorage.getItem(STORAGE_KEY);

      if (!storedLectures) {
        return;
      }

      const parsedLectures: DownloadedLecture[] = JSON.parse(storedLectures);

      const validLectures: DownloadedLecture[] = [];

      if (!FileSystem) {
        setDownloadedLectures(parsedLectures);
        return;
      }

      for (const lecture of parsedLectures) {
        const fileInfo = await FileSystem.getInfoAsync(lecture.path);

        if (fileInfo.exists) {
          validLectures.push(lecture);
        }
      }

      setDownloadedLectures(validLectures);

      await saveDownloadsToStorage(validLectures);
    } catch (error) {
      console.error("Initialize downloads error:", error);
    }
  }, [ensureDownloadsDirectory, saveDownloadsToStorage]);

  useEffect(() => {
    initializeDownloads();
  }, [initializeDownloads]);

  // =========================================
  // DOWNLOAD
  // =========================================

  const downloadLecture = useCallback(
    async (
      lectureId: string,
      lectureUrl: string,
      title: string,
      type: string,
    ) => {
      if (!lectureUrl) {
        Toast.show({
          type: "error",
          text1: "خطأ",
          text2: "رابط المحاضرة غير متاح",
        });

        return;
      }

      try {
        setIsLoading(true);

        const existingLecture = getLectureById(lectureId);

        if (existingLecture) {
          if (Platform.OS === "web") {
            // On web, just mark as downloaded
            Toast.show({
              type: "info",
              text1: "معلومة",
              text2: "تم تحميل هذه المحاضرة بالفعل",
            });
            return;
          }

          if (!FileSystem) return;

          const fileInfo = await FileSystem.getInfoAsync(existingLecture.path);

          if (fileInfo.exists) {
            Toast.show({
              type: "info",
              text1: "معلومة",
              text2: "تم تحميل هذه المحاضرة بالفعل",
            });

            return;
          }
        }

        const extension = getFileExtensionFromUrl(lectureUrl);

        const sanitizedTitle = title.replace(/[<>:"/\\|?*]/g, "").trim();

        const fileName = `${lectureId}.${extension}`;

        // =====================================
        // WEB DOWNLOAD
        // =====================================

        if (Platform.OS === "web") {
          try {
            const response = await fetch(lectureUrl);
            const blob = await response.blob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${sanitizedTitle}.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setDownloadProgress((prev) => ({
              ...prev,
              [lectureId]: 100,
            }));

            const lectureData: DownloadedLecture = {
              id: lectureId,
              title: sanitizedTitle,
              type,
              path: url, // Store blob URL for web
              extension,
            };

            const updatedLectures = [
              ...downloadedLectures.filter((l) => l.id !== lectureId),
              lectureData,
            ];

            setDownloadedLectures(updatedLectures);
            await saveDownloadsToStorage(updatedLectures);

            Toast.show({
              type: "success",
              text1: "نجح التحميل",
              text2: `تم تحميل: ${sanitizedTitle}`,
            });

            setTimeout(() => {
              setDownloadProgress((prev) => {
                const updated = { ...prev };
                delete updated[lectureId];
                return updated;
              });
            }, 1500);
          } catch (error) {
            console.error("Web download error:", error);
            throw error;
          }
          return;
        }

        // =====================================
        // NATIVE DOWNLOAD
        // =====================================

        if (!FileSystem) return;

        await ensureDownloadsDirectory();

        const filePath = `${DOWNLOADS_DIR}${fileName}`;

        const downloadResumable = FileSystem.createDownloadResumable(
          lectureUrl,
          filePath,
          {},
          (progressEvent) => {
            const progress =
              progressEvent.totalBytesExpectedToWrite > 0
                ? (progressEvent.totalBytesWritten /
                    progressEvent.totalBytesExpectedToWrite) *
                  100
                : 0;

            setDownloadProgress((prev) => ({
              ...prev,
              [lectureId]: progress,
            }));
          },
        );

        const result = await downloadResumable.downloadAsync();

        if (!result) {
          throw new Error("Download failed");
        }

        const lectureData: DownloadedLecture = {
          id: lectureId,
          title: sanitizedTitle,
          type,
          path: filePath,
          extension,
        };

        const updatedLectures = [
          ...downloadedLectures.filter((l) => l.id !== lectureId),

          lectureData,
        ];

        setDownloadedLectures(updatedLectures);

        await saveDownloadsToStorage(updatedLectures);

        setDownloadProgress((prev) => ({
          ...prev,
          [lectureId]: 100,
        }));

        Toast.show({
          type: "success",
          text1: "نجح التحميل",
          text2: `تم تحميل: ${sanitizedTitle}`,
        });

        setTimeout(() => {
          setDownloadProgress((prev) => {
            const updated = {
              ...prev,
            };

            delete updated[lectureId];

            return updated;
          });
        }, 1500);
      } catch (error) {
        console.error("Download error:", error);

        Toast.show({
          type: "error",
          text1: "خطأ في التحميل",
          text2: "حدث خطأ أثناء تحميل المحاضرة",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [
      downloadedLectures,
      ensureDownloadsDirectory,
      getFileExtensionFromUrl,
      getLectureById,
      saveDownloadsToStorage,
    ],
  );

  // =========================================
  // DELETE
  // =========================================

  const deleteLecture = useCallback(
    async (lectureId: string) => {
      try {
        const lecture = getLectureById(lectureId);

        if (!lecture) {
          return;
        }

        if (Platform.OS === "web") {
          // On web, just remove from list
          const updatedLectures = downloadedLectures.filter(
            (l) => l.id !== lectureId,
          );

          setDownloadedLectures(updatedLectures);

          await saveDownloadsToStorage(updatedLectures);

          Toast.show({
            type: "success",
            text1: "تم الحذف",
            text2: "تم حذف المحاضرة بنجاح",
          });

          return;
        }

        if (!FileSystem) return;

        const fileInfo = await FileSystem.getInfoAsync(lecture.path);

        if (fileInfo.exists) {
          await FileSystem.deleteAsync(lecture.path);
        }

        const updatedLectures = downloadedLectures.filter(
          (l) => l.id !== lectureId,
        );

        setDownloadedLectures(updatedLectures);

        await saveDownloadsToStorage(updatedLectures);

        Toast.show({
          type: "success",
          text1: "تم الحذف",
          text2: "تم حذف المحاضرة بنجاح",
        });
      } catch (error) {
        console.error("Delete error:", error);

        Toast.show({
          type: "error",
          text1: "خطأ",
          text2: "فشل حذف المحاضرة",
        });
      }
    },
    [downloadedLectures, getLectureById, saveDownloadsToStorage],
  );

  // =========================================
  // OPEN FILE
  // =========================================

  const openLecture = useCallback(
    async (lectureId: string) => {
      try {
        const lecture = getLectureById(lectureId);

        if (!lecture) {
          Toast.show({
            type: "error",
            text1: "خطأ",
            text2: "المحاضرة غير موجودة",
          });

          return;
        }

        // =====================================
        // WEB OPEN
        // =====================================

        if (Platform.OS === "web") {
          if (
            lecture.path.startsWith("blob:") ||
            lecture.path.startsWith("http")
          ) {
            // For blob URLs or direct URLs, just open them
            window.open(lecture.path, "_blank");
          } else {
            // Try to open as a link
            Linking.openURL(lecture.path);
          }
          return;
        }

        if (!FileSystem) return;

        const fileInfo = await FileSystem.getInfoAsync(lecture.path);

        if (!fileInfo.exists) {
          Toast.show({
            type: "error",
            text1: "خطأ",
            text2: "الملف غير موجود",
          });

          return;
        }

        const mimeType = getMimeType(lecture.extension);

        // =====================================
        // ANDROID
        // =====================================

        if (Platform.OS === "android") {
          if (!IntentLauncher) return;

          const contentUri = await FileSystem.getContentUriAsync(lecture.path);

          await IntentLauncher.startActivityAsync(
            "android.intent.action.VIEW",
            {
              data: contentUri,
              flags: 1,
              type: mimeType,
            },
          );

          return;
        }

        // =====================================
        // IOS
        // =====================================

        await Linking.openURL(lecture.path);
      } catch (error) {
        console.error("Open error:", error);

        Toast.show({
          type: "error",
          text1: "خطأ",
          text2: "لا يمكن فتح الملف",
        });
      }
    },
    [getLectureById],
  );

  // =========================================
  // CHECK DOWNLOADED
  // =========================================

  const isLectureDownloaded = useCallback(
    async (lectureId: string) => {
      try {
        const lecture = downloadedLectures.find((l) => l.id === lectureId);

        if (!lecture) {
          return false;
        }

        if (Platform.OS === "web") {
          return true;
        }

        if (!FileSystem) return false;

        const fileInfo = await FileSystem.getInfoAsync(lecture.path);

        return fileInfo.exists;
      } catch {
        return false;
      }
    },
    [downloadedLectures],
  );

  return {
    downloadProgress,
    downloadedLectures,
    isLoading,

    initializeDownloads,

    downloadLecture,
    deleteLecture,
    openLecture,

    isLectureDownloaded,
  };
};
