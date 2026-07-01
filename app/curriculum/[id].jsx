import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TextInput,
  SectionList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fonts } from "@/theme/fonts";
import { useContext, useMemo, useCallback, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { useLectures } from "@/hooks/useLectures";
import { Feather } from "@expo/vector-icons";
import { Lecture_Types } from "@/data/lectures";
import CurriculumTypeChip from "@/components/CurriculumTypeChip";
import LectureCard from "@/components/LectureCard";
import ErrorIndicator from "@/components/ErrorIndicator";
import LoadingIndicator from "@/components/LoadingIndicator";
export default function CurriculumList() {
  const { id } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);
  const { data: lectures, isLoading, error, refetch } = useLectures(id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("الكل");
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

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

  if (isLoading) return <LoadingIndicator />;
  if (error)
    return (
      <ErrorIndicator state="error" text={error.message} onRetry={onRefresh} />
    );

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
        keyExtractor={(item) => item.id}
        renderItem={renderLecture}
        refreshing={refreshing}
        onRefresh={onRefresh}
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
          <ErrorIndicator text="لا يوجد محاضرات لهذا الفرع" />
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
    },
    searchContainer: {
      flexDirection: "row",
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
      padding: 0,
    },
    sectionHeader: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },

    sectionHeaderText: {
      fontFamily: fonts.bold,
      fontSize: 14,
      color: theme.title,
    },
  });
}
