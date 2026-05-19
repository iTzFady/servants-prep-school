import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { fonts } from "./fonts";
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderRightColor: "green",
        borderRightWidth: 5,
        borderLeftWidth: 0,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        textAlign: "right",
        fontFamily: fonts.medium,
      }}
      text2Style={{
        textAlign: "right",
        fontFamily: fonts.medium,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderRightColor: "red",
        borderRightWidth: 5,
        borderLeftWidth: 0,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        textAlign: "right",
        fontFamily: fonts.medium,
      }}
      text2Style={{
        textAlign: "right",
        fontFamily: fonts.medium,
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderRightColor: "orange",
        borderRightWidth: 5,
        borderLeftWidth: 0,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        textAlign: "right",
        fontFamily: fonts.medium,
      }}
      text2Style={{
        textAlign: "right",
        fontFamily: fonts.medium,
      }}
    />
  ),
};
export default toastConfig;
