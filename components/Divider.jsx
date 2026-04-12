import { memo } from "react";
import { View } from "react-native";

function Divider({ separatorWidth, margin }) {
  return (
    <View
      style={{
        backgroundColor: "#00000025",
        marginBlock: margin,
        marginHorizontal: "auto",
        height: 1.5,
        width: separatorWidth,
      }}
    />
  );
}
export default memo(Divider);
