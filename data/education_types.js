export const educationTypes = [
  { id: 0, label: "ثانوية عامة", value: "general_secondary" },
  { id: 1, label: "دبلوم فني (صناعي)", value: "technical_industrial" },
  { id: 2, label: "دبلوم فني (تجاري)", value: "technical_commercial" },
  { id: 3, label: "دبلوم فني (زراعي)", value: "technical_agricultural" },
  { id: 4, label: "دبلوم فندقي", value: "technical_hotel" },
  { id: 5, label: "معهد سنتين", value: "institute_2years" },
  { id: 6, label: "معهد عالي", value: "higher_institute" },
  { id: 7, label: "كلية", value: "college" },
  { id: 8, label: "خريج", value: "graduate" },
];

export const serverntPrepYear = [
  { id: 0, label: "السنة الأولى", value: "1" },
  { id: 1, label: "السنة الثانية", value: "2" },
];

export function getEducationLabel(value) {
  return educationTypes.find((item) => item.value === value)?.label || "";
}
