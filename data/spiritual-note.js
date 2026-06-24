import {
  AntDesign,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

export const spiritualNoteActivities = [
  {
    key: "mass",
    title: "القداس الإلهي",
    icon: ({ color }) => <FontAwesome5 name="church" size={16} color={color} />,
  },
  {
    key: "bible",
    title: "إنجيل",
    icon: ({ color }) => <FontAwesome5 name="bible" size={16} color={color} />,
  },
  {
    key: "confession",
    title: "الاعتراف",
    description: "يتطلب تأكيد الأب الكاهن",
    icon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
    qr: true,
  },
  {
    key: "morning",
    title: "صلاة باكر",
    icon: ({ color }) => <MaterialIcons name="sunny" size={16} color={color} />,
  },
  {
    key: "evening",
    title: "صلاة الغروب",
    icon: ({ color }) => (
      <MaterialCommunityIcons name="weather-sunset" size={24} color={color} />
    ),
  },
  {
    key: "sleep",
    title: "صلاة النوم",
    icon: ({ color }) => <AntDesign name="moon" size={16} color={color} />,
  },
];
