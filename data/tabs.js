import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

export const dashboardTabs = [
  {
    id: 0,
    label: "الحضور و الغياب",
    description: "سجل المحاضرات واللقاءات",
    icon: ({ color }) => <Feather name="calendar" size={24} color={color} />,
    value: "attendance",
  },
  {
    id: 1,
    label: "المنهج",
    description: "تصفح المناهج والكتب",
    icon: ({ color }) => <Feather name="book-open" size={24} color={color} />,
    value: "curriculum",
  },
  {
    id: 2,
    label: "النوتة الروحية",
    description: "متابعة صلواتك والتزامك",
    icon: ({ color }) => <Feather name="heart" size={24} color={color} />,
    value: "spiritual-note",
  },
  {
    id: 3,
    label: "الواجبات",
    description: "تسليم الواجب الاسبوعي",
    icon: ({ color }) => <Feather name="clipboard" size={24} color={color} />,
    value: "assignments",
  },
  {
    id: 4,
    label: "النتائج",
    description: "كشف درجات الاختبارات",
    icon: ({ color }) => <Feather name="bar-chart-2" size={24} color={color} />,
    value: "results",
  },
  {
    id: 5,
    label: "الارشيف",
    description: "رحلات و مناسبات سابقة",
    icon: ({ color }) => <Feather name="archive" size={24} color={color} />,
    value: "archive",
  },
];

export const AdmindashboardTabs = [
  {
    id: 0,
    label: " ادارة المنهج",
    description: "ادارة و تصفح المناهج",
    icon: ({ color }) => <Feather name="book-open" size={24} color={color} />,
    value: "admin/curriculum",
  },
  {
    id: 1,
    label: "ادارة الحضور",
    description: "متابعة وتسجيل الحضور والغياب",
    icon: ({ color }) => <Feather name="calendar" size={24} color={color} />,
    value: "admin/attendance",
  },
  {
    id: 2,
    label: "قائمة المخدومين",
    description: "عرض معلومات وسجل المخدوم",
    icon: ({ color }) => <Feather name="users" size={24} color={color} />,
    value: "admin/students",
  },
  {
    id: 3,
    label: "ادارة الحسابات",
    description: "ادارة ومراجعة الحسابات",
    icon: ({ color }) => <Feather name="user-check" size={24} color={color} />,
    value: "admin/accounts",
  },
  {
    id: 4,
    label: "ادارة النوتة الروحية",
    description: "متابعة التزام المخدوم",
    icon: ({ color }) => <Feather name="heart" size={24} color={color} />,
    value: "admin/spiritual-note",
  },
  {
    id: 5,
    label: "ادارة الواجبات",
    description: "انشاء ومتابعة الواجبات",
    icon: ({ color }) => <Feather name="clipboard" size={24} color={color} />,
    value: "assignments",
  },
  {
    id: 6,
    label: "ادارة النتائج",
    description: "رصد ومتابعة درجات الاختبارات",
    icon: ({ color }) => <Feather name="bar-chart-2" size={24} color={color} />,
    value: "admin/results",
  },

  {
    id: 7,
    label: "ادارة الارشيف",
    description: "رفع وتحديث الارشيف",
    icon: ({ color }) => <Feather name="archive" size={24} color={color} />,
    value: "archive",
  },
];

export const attendanceTabs = [
  {
    id: 0,
    label: "تسجيل الحضور",
    description: "تسجيل الحضور باستخدام رمز ال QR",
    icon: ({ color }) => (
      <MaterialCommunityIcons name="qrcode" size={24} color={color} />
    ),
    value: "admin/attendance/qr",
  },
  {
    id: 1,
    label: " تسجيل الحضور",
    description: "تسجيل الحضور يدويا",
    icon: ({ color }) => (
      <MaterialCommunityIcons name="typewriter" size={24} color={color} />
    ),
    value: "admin/attendance/manual",
  },
  {
    id: 2,
    label: "متابعة الحضور والغياب",
    description: "متابعة التزام المخدومين",
    icon: ({ color }) => <Fontisto name="preview" size={24} color={color} />,
    value: "admin/attendance/list",
  },
];

export const noteTabs = [
  {
    id: 0,
    label: "تسجيل الاعتراف",
    description: "تسجيل الاعتراف للمخدومين",
    icon: ({ color }) => (
      <MaterialIcons name="qr-code-scanner" size={24} color={color} />
    ),
    value: "admin/spiritual-note/confession/qr",
  },
  {
    id: 1,
    label: "تسجيل الاعتراف يدويا",
    description: "تسجيل الاعتراف للمخدومين يدويا",
    icon: ({ color }) => (
      <MaterialCommunityIcons name="typewriter" size={24} color={color} />
    ),
    value: "admin/spiritual-note/confession/manual",
  },
  {
    id: 2,
    label: "متابعة النوتة الروحية",
    description: "متابعة الالتزام الروحي للمخدومين",
    icon: ({ color }) => <Fontisto name="preview" size={24} color={color} />,
    value: "admin/spiritual-note/list",
  },
];

export const curriculumTabs = [
  {
    id: 0,
    label: "الألحان",
    icon: ({ color }) => <Entypo name="note" size={24} color={color} />,
    value: "HYMNS",
  },
  {
    id: 1,
    label: "طقس",
    icon: ({ color }) => <Feather name="book-open" size={24} color={color} />,
    value: "RITUALS",
  },
  {
    id: 2,
    label: "تاريخ الكنيسة",
    icon: ({ color }) => <FontAwesome5 name="church" size={24} color={color} />,
    value: "CHURCH_HISTORY",
  },
  {
    id: 3,
    label: "عقيدة",
    icon: ({ color }) => (
      <MaterialCommunityIcons name="cross-outline" size={24} color={color} />
    ),
    value: "DOCTRINE",
  },
  {
    id: 4,
    label: "موضوعات خدمة",
    icon: ({ color }) => <FontAwesome name="group" size={24} color={color} />,
    value: "SERVICE_TOPICS",
  },
  {
    id: 5,
    label: "الكتاب المقدس",
    icon: ({ color }) => <FontAwesome5 name="bible" size={24} color={color} />,
    value: "BIBLE",
  },
];

export function getCurriculumLabel(value) {
  return curriculumTabs.find((item) => item.value === value)?.label || "";
}
