import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { memo, useContext, useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

function CustomDropdown({ data, dropdownLabel, value, onChange, placeHolder }) {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);

  const renderDropdownItems = (item) => {
    return (
      <View style={styles.dropdownItemContainer}>
        <Text style={styles.dropdownItem}>{item.label}</Text>
      </View>
    );
  };

  return (
    <>
      {Platform.OS === "web" ? (
        <View style={styles.container}>
          {dropdownLabel && <Text style={styles.label}>{dropdownLabel}</Text>}
          <select
            value={value}
            onChange={(e) => onChange(e.currentTarget.value)}
            style={styles.select}
            placeholder={placeHolder}
          >
            {data.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </View>
      ) : (
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>{dropdownLabel}</Text>
          <Dropdown
            style={styles.dropdown}
            mode="modal"
            data={data}
            placeholderStyle={styles.dropdownPlaceholder}
            selectedTextStyle={styles.dropdownSelectText}
            itemTextStyle={styles.dropdownItem}
            maxHeight={250}
            labelField="label"
            valueField="value"
            onChange={onChange}
            placeholder={placeHolder}
            value={value}
            renderItem={renderDropdownItems}
          />
        </View>
      )}
    </>
  );
}
function createStyles(theme, fonts) {
  return StyleSheet.create({
    container: {
      width: "100%",
      marginTop: 10,
      alignSelf: "center",
    },
    label: {
      textAlign: "right",
      fontSize: 12,
      marginBottom: 5,
      fontFamily: fonts.medium,
    },
    select: {
      width: "100%",
      height: 25,
      fontSize: 12,
      paddingHorizontal: 10,
      borderRadius: 5,
      fontFamily: fonts.extraLight,
      textAlign: "right",
      writingDirection: "rtl",
    },
    dropdownLabel: {
      fontFamily: fonts.medium,
      fontSize: 14,
      marginVertical: 5,
      width: "100%",
      textAlign: "right",
      color: theme.textSecondary,
    },
    dropdown: {
      height: 50,
      width: "100%",
      gap: 10,
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.dropdown.border,
      backgroundColor: theme.dropdown.background,
    },
    dropdownSelectText: {
      textAlign: "right",
      fontSize: 20,
      fontFamily: fonts.extraLight,
    },
    dropdownPlaceholder: {
      textAlign: "right",
      marginRight: 8,
      fontSize: 16,
      fontFamily: fonts.extraLight,
      color: theme.dropdown.text,
    },
    dropdownItemContainer: {
      flexDirection: "row-reverse",
      alignItems: "center",
      margin: 10,
    },
    dropdownItem: {
      textAlign: "right",
      fontSize: 20,
      marginRight: 15,
      fontFamily: fonts.extraLight,
    },
  });
}
export default memo(CustomDropdown);
