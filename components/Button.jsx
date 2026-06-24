import { fonts } from "@/theme/fonts";
import { memo } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

function Button({
  text,
  prefixIcon,
  onPressEvent,
  style,
  loading,
  disabled,
  width = "100%",
  height = 50,
  borderRadius = 10,
}) {
  return (
    <Pressable
      style={[
        {
          borderRadius: borderRadius,
          width,
          height: height,
          justifyContent: "center",
          marginBlock: 25,
        },
        style,
        disabled && {
          opacity: 0.5,
        },
      ]}
      disabled={loading || disabled}
      onPress={onPressEvent}
    >
      {loading ? (
        <ActivityIndicator
          style={{ marginVertical: "auto", paddingVertical: "auto" }}
          size="small"
          color={style.color}
        />
      ) : (
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "center",
          }}
        >
          {prefixIcon}
          {text && (
            <Text
              style={{
                color: style?.color || "white",
                fontFamily: fonts.bold,
                textAlign: "center",
              }}
            >
              {text}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

export default memo(Button);
