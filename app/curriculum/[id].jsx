import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  SectionList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fonts } from "@/theme/fonts";
import { useContext, useMemo, useCallback, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { useLectures } from "@/hooks/useApi";
import { MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import { Lecture_Types } from "@/data/lectures";
import CurriculumTypeChip from "@/components/CurriculumTypeChip";
import LectureCard from "@/components/LectureCard";
export default function CurriculumList() {
  const { id } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const { data: lectures, isLoading, error } = useLectures(id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("الكل");

  const filteredLectures = useMemo(() => {
    if (!lectures) return [];
    return lectures.filter((lecture) => {
      const matchesSearch = lecture.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        selectedType === "الكل" ||
        Lecture_Types[lecture.type]?.label === selectedType;
      return matchesSearch && matchesType;
    });
  }, [lectures, searchQuery, selectedType]);

  const groupedLectures = useMemo(() => {
    const grouped = {};

    filteredLectures.forEach((lecture) => {
      const date = new Date(lecture.date).toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(lecture);
    });

    return Object.keys(grouped).map((date) => ({
      title: date,
      data: grouped[date],
    }));
  }, [filteredLectures]);

  const renderLecture = useCallback(
    ({ item }) => {
      const typeConfig = Lecture_Types[item.type] || Lecture_Types.document;
      return <LectureCard typeConfig={typeConfig} item={item} subject={id} />;
    },
    [id],
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.section.color} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialIcons name="error" size={34} color={theme.section.color} />
        <Text style={styles.errorText}>حدث خطأ أثناء تحميل الدروس</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={theme.inputField.color} />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن درس محدد..."
          placeholderTextColor={theme.inputField.color}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        horizontal
        data={Object.entries(Lecture_Types)}
        keyExtractor={([key]) => key}
        showsHorizontalScrollIndicator={false}
        style={{
          height: 60,
          flexGrow: 0,
        }}
        contentContainerStyle={{
          paddingHorizontal: 10,
          alignItems: "center",
        }}
        inverted={true}
        renderItem={({ item: [key, value] }) => (
          <CurriculumTypeChip
            key={key}
            icon={value.icon(
              selectedType === value.label
                ? { color: theme.chips.selected.color }
                : { color: theme.chips.unSelected.color },
            )}
            text={value.label}
            selected={selectedType === value.label}
            onPressEvent={() => setSelectedType(value.label)}
          />
        )}
      />
      <SectionList
        sections={groupedLectures}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLecture}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{`● ${title}`}</Text>
          </View>
        )}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{
          flexGrow: 1,
          gap: 10,
        }}
        ListEmptyComponent={
          <View style={[styles.container, styles.centerContent, { flex: 1 }]}>
            <AntDesign name="dropbox" size={34} color={theme.section.color} />
            <Text style={styles.errorText}>لا يوجد محاضرات لهذا الفرع</Text>
          </View>
        }
      />
    </View>
  );
}
function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      flex: 1,
      gap: 5,
      backgroundColor: theme.background,
    },
    centerContent: {
      justifyContent: "center",
      alignItems: "center",
    },
    searchContainer: {
      flexDirection: "row-reverse",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.inputField.background,
      borderRadius: 12,
      marginHorizontal: 16,
      marginTop: 12,
      gap: 8,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    searchInput: {
      flex: 1,
      fontFamily: fonts.regular,
      fontSize: 14,
      color: theme.inputField.color,
      textAlign: "right",
      padding: 0,
    },

    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: "#999",
      textAlign: "center",
    },
    errorText: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: theme.section.color,
      marginTop: 12,
      textAlign: "center",
    },
    sectionHeader: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },

    sectionHeaderText: {
      fontFamily: fonts.bold,
      fontSize: 14,
      color: theme.title,
      textAlign: "right",
    },
  });
}
