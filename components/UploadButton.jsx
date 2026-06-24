import { Entypo, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import * as Sentry from "@sentry/react-native";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { Image } from "expo-image";

const defaultProfilePic = require("@/assets/images/default-profile.webp");

export default function UploadButton({ value, onChange }) {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  async function pickImage() {
    try {
      setLoading(true);
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("برجاء الموافقة علي الاذونات لاستكمال العملية");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled) {
        const image = result.assets[0];
        setPreviewImage(image.uri);
        let file;
        if (Platform.OS === "web") {
          file = image.file;
        } else {
          const uri = image.uri;
          const filename = uri.split("/").pop();
          const match = /\.(\w+)$/.exec(filename ?? "");
          const type = match ? `image/${match[1]}` : "image/jpeg";
          file = {
            uri,
            name: filename,
            type,
          };
        }

        onChange(file);
      }
    } catch (error) {
      Sentry.captureException(new Error(error));
    } finally {
      setLoading(false);
    }
  }

  const profilePicButton = (
    <>
      <Pressable style={styles.profilePicButton} onPress={pickImage}>
        <Image
          source={previewImage ? { uri: previewImage } : defaultProfilePic}
          style={styles.profileImage}
        />
        <View style={styles.overlay} />

        {loading ? (
          <ActivityIndicator
            style={{ marginVertical: "auto", paddingVertical: "auto" }}
            size="small"
            color="white"
          />
        ) : value ? (
          <Feather name="edit" size={24} color="white" />
        ) : (
          <Entypo name="plus" size={24} color="white" />
        )}
      </Pressable>
    </>
  );
  return <View style={{ padding: 20 }}>{profilePicButton}</View>;
}
const styles = StyleSheet.create({
  profilePicButton: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    borderWidth: 1,
    alignSelf: "center",
  },
  profileImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 100,
  },
});
