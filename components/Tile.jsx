import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import { memo, useContext, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
function Tile({ icon, title, data }) {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme, fonts), [theme]);

  return (
    <View style={styles.infoTile}>
      <View style={styles.iconContainer}>
        {icon && icon({ color: theme.profile.sectionTile.icon })}
      </View>
      <View style={styles.tileTextContainer}>
        <Text style={styles.tileTitle}>{title}</Text>
        <Text style={styles.tileData}>{data}</Text>
      </View>
    </View>
  );
}

export default memo(Tile);

function createStyles(theme, fonts) {
  return StyleSheet.create({
    infoTile: {
      padding: 16,
      gap: 16,
      alignItems: "center",
      flexDirection: "row-reverse",
    },
    iconContainer: {
      padding: 20,
      borderRadius: 10,
      backgroundColor: theme.profile.sectionTile.iconBackground,
    },
    tileTitle: {
      fontFamily: fonts.regular,
      fontSize: 12,
      color: theme.profile.sectionTile.title,
    },
    tileData: {
      fontFamily: fonts.medium,
      fontSize: 14,
      color: theme.profile.sectionTile.info,
    },
    tileTextContainer: {
      alignItems: "flex-end",
    },
  });
}
