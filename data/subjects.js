import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export const SubjectTabs = [
  {
    id: 0,
    label: "الألحان",
    icon: ({ color, size }) => <Entypo name="note" size={size} color={color} />,
    value: "HYMNS",
  },
  {
    id: 1,
    label: "طقس",
    icon: ({ color, size }) => (
      <Feather name="book-open" size={size} color={color} />
    ),
    value: "RITUALS",
  },
  {
    id: 2,
    label: "تاريخ الكنيسة",
    icon: ({ color, size }) => (
      <FontAwesome5 name="church" size={size} color={color} />
    ),
    value: "CHURCH_HISTORY",
  },
  {
    id: 3,
    label: "عقيدة",
    icon: ({ color, size }) => (
      <MaterialCommunityIcons name="cross-outline" size={size} color={color} />
    ),
    value: "DOCTRINE",
  },
  {
    id: 4,
    label: "موضوعات خدمة",
    icon: ({ color, size }) => (
      <FontAwesome name="group" size={size} color={color} />
    ),
    value: "SERVICE_TOPICS",
  },
  {
    id: 5,
    label: "الكتاب المقدس",
    icon: ({ color, size }) => (
      <FontAwesome5 name="bible" size={size} color={color} />
    ),
    value: "BIBLE",
  },
  {
    id: 6,
    label: "محفوظات",
    icon: ({ color, size }) => (
      <Ionicons name="newspaper" size={size} color={color} />
    ),
    value: "MEMORIZATION_TEXTS",
  },
];

export function getSubjectLabel(value) {
  return SubjectTabs.find((item) => item.value === value)?.label || "";
}
