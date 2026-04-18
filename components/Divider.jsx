import { memo } from "react";
import { View } from "react-native";

function Divider({ separatorWidth, margin, color }) {
  return (
    <View
      style={{
        backgroundColor: color,
        marginBlock: margin,
        marginHorizontal: "auto",
        height: 1.5,
        width: separatorWidth,
      }}
    />
  );
}
export default memo(Divider);
