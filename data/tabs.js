import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export const dashboardTabs = [
  {
    id: 0,
    label: "المنهج",
    description: "تصفح المناهج والكتب",
    icon: ({ color }) => <Feather name="book-open" size={24} color={color} />,
    value: "curriculum",
  },
  {
    id: 1,
    label: "الحضور و الغياب",
    description: "سجل المحاضرات واللقاءات",
    icon: ({ color }) => <Feather name="calendar" size={24} color={color} />,
    value: "attendance",
  },
  {
    id: 2,
    label: "الواجبات",
    description: "تسليم الواجب الاسبوعي",
    icon: ({ color }) => <Feather name="clipboard" size={24} color={color} />,
    value: "assignments",
  },
  {
    id: 3,
    label: "النتائج",
    description: "كشف درجات الاختبارات",
    icon: ({ color }) => <Feather name="bar-chart-2" size={24} color={color} />,
    value: "results",
  },
  {
    id: 4,
    label: "النوتة الروحية",
    description: "متابعة صلواتك والتزامك",
    icon: ({ color }) => <Feather name="heart" size={24} color={color} />,
    value: "spiritual_note",
  },
  {
    id: 5,
    label: "الارشيف",
    description: "رحلات و مناسبات سابقة",
    icon: ({ color }) => <Feather name="archive" size={24} color={color} />,
    value: "archive",
  },
];

export const curriculumTabs = [
  {
    id: 0,
    label: "طقس",
    icon: ({ color }) => <Feather name="book-open" size={24} color={color} />,
    value: "curriculum",
  },
  {
    id: 1,
    label: "الألحان",

    icon: ({ color }) => <Entypo name="note" size={24} color={color} />,
    value: "attendance",
  },
  {
    id: 2,
    label: "عقيدة",
    icon: ({ color }) => (
      <MaterialCommunityIcons name="cross-outline" size={24} color={color} />
    ),
    value: "assignments",
  },
  {
    id: 3,
    label: "تاريخ الكنيسة",
    icon: ({ color }) => <FontAwesome5 name="church" size={24} color={color} />,
    value: "results",
  },
  {
    id: 4,
    label: "الكتاب المقدس",
    icon: ({ color }) => <FontAwesome5 name="bible" size={24} color={color} />,
    value: "spiritual_note",
  },
  {
    id: 5,
    label: "موضوعات خدمة",
    icon: ({ color }) => <FontAwesome name="group" size={24} color={color} />,
    value: "archive",
  },
];
