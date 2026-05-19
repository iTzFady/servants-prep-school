import {
  Entypo,
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export const Lecture_Types = {
  all: {
    icon: ({ color }) => <AntDesign name="dropbox" size={16} color={color} />,
    label: "الكل",
  },
  image: {
    icon: ({ color }) => <Entypo name="images" size={16} color={color} />,
    label: "صور",
  },
  video: {
    icon: ({ color }) => <Entypo name="video" size={16} color={color} />,
    label: "فيديو",
  },
  audio: {
    icon: ({ color }) => (
      <MaterialIcons name="audio-file" size={16} color={color} />
    ),
    label: "صوت",
  },
  document: {
    icon: ({ color }) => (
      <MaterialCommunityIcons name="file-document" size={16} color={color} />
    ),
    label: "مستند",
  },
};
