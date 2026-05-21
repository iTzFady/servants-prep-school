import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useContext, useMemo, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function FileUploadButton({
  value,
  onChange,
  accept = ["image", "video", "document"],
}) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  async function pickFile() {
    try {
      setLoading(true);

      let result;

      const wantsMedia = accept.includes("image") || accept.includes("video");

      if (wantsMedia) {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          alert("برجاء الموافقة علي الاذونات");
          return;
        }

        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes:
            accept.includes("image") && accept.includes("video")
              ? ["images", "videos"]
              : accept.includes("video")
                ? ["videos"]
                : ["images"],

          quality: 0.8,
        });

        if (result.canceled) return;

        const asset = result.assets[0];

        setPreview(asset.type === "image" ? asset.uri : null);

        let file;

        if (Platform.OS === "web") {
          file = asset.file;
        } else {
          file = {
            uri: asset.uri,
            name: asset.fileName || asset.uri.split("/").pop(),
            type: asset.mimeType || `${asset.type}/*`,
          };
        }

        onChange(file);
        return;
      }

      result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const fileAsset = result.assets[0];

      setPreview(null);

      let file;

      if (Platform.OS === "web") {
        file = fileAsset.file;
      } else {
        file = {
          uri: fileAsset.uri,
          name: fileAsset.name,
          type: fileAsset.mimeType,
        };
      }

      onChange(file);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const fileName =
    value?.name || value?.fileName || "اسحب الملف هنا أو اضغط للرفع";

  return (
    <Pressable onPress={pickFile} style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#5A47D6" />
      ) : (
        <>
          {preview ? (
            <Image source={{ uri: preview }} style={styles.preview} />
          ) : (
            <View style={styles.iconCircle}>
              <Feather name="upload" size={28} color="#5A47D6" />
            </View>
          )}

          <Text style={styles.title}>
            {value ? fileName : "اسحب الملف هنا أو اضغط للرفع"}
          </Text>

          {!value && (
            <Text style={styles.subtitle}>
              يدعم PDF, MP4, MP3 (حد أقصى 50 ميجابايت)
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
}
function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: theme.inputField.borderColor,
      borderRadius: 16,
      minHeight: 220,

      justifyContent: "center",
      alignItems: "center",

      padding: 20,
      backgroundColor: theme.inputField.background,
    },

    iconCircle: {
      width: 70,
      height: 70,

      borderRadius: 35,

      backgroundColor: "#ECEAFB",

      justifyContent: "center",
      alignItems: "center",

      marginBottom: 18,
    },

    title: {
      fontSize: 16,
      color: theme.inputField.color,
      textAlign: "center",
      fontFamily: fonts.medium,
    },

    subtitle: {
      marginTop: 8,
      color: theme.inputField.color,
      fontFamily: fonts.light,
      fontSize: 13,
      textAlign: "center",
    },

    preview: {
      width: 100,
      height: 100,
      borderRadius: 12,
      marginBottom: 16,
    },
  });
}
