export const days = [
  { id: 0, label: "السبت", value: "saturday" },
  { id: 1, label: "الأحد", value: "sunday" },
  { id: 2, label: "الإتنين", value: "monday" },
  { id: 3, label: "الثلاثاء", value: "tuesday" },
  { id: 4, label: "الأربعاء", value: "wednesday" },
  { id: 5, label: "الخميس", value: "thursday" },
  { id: 6, label: "الجمعة", value: "friday" },
];

export function getDayLabel(value) {
  return days.find((item) => item.value === value)?.label || "";
}
