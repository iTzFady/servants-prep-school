import { fonts } from "@/theme/fonts";
import { memo } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

function Button({ text, prefixIcon, onPressEvent, style, loading, disabled }) {
  return (
    <Pressable
      style={[
        {
          borderRadius: 10,
          width: "100%",
          height: 50,
          justifyContent: "center",
          marginBlock: 25,
        },
        style,
      ]}
      disabled={loading || disabled}
      onPress={onPressEvent}
    >
      {loading ? (
        <ActivityIndicator
          style={{ marginVertical: "auto", paddingVertical: "auto" }}
          size="small"
          color="#000"
        />
      ) : (
        <View
          style={{
            flexDirection: "row-reverse",
            gap: 10,
            justifyContent: "center",
          }}
        >
          {prefixIcon}
          <Text
            style={{
              color: style.color || "white",
              fontFamily: fonts.bold,
              textAlign: "center",
            }}
          >
            {text}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export default memo(Button);
