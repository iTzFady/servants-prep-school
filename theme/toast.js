import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { fonts } from "./fonts";
const toastConfig = {
  success: (props) => (
    <BaseToast
      style={{
        borderStartColor: "green",
        borderStartWidth: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontFamily: fonts.medium,
      }}
      text2Style={{
        fontFamily: fonts.medium,
      }}
      {...props}
    />
  ),
  error: (props) => (
    <ErrorToast
      style={{
        borderStartColor: "red",
        borderStartWidth: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontFamily: fonts.medium,
      }}
      text2Style={{
        fontFamily: fonts.medium,
      }}
      {...props}
    />
  ),
  info: (props) => (
    <BaseToast
      style={{
        borderStartColor: "orange",
        borderStartWidth: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontFamily: fonts.medium,
      }}
      text2Style={{
        fontFamily: fonts.medium,
      }}
      {...props}
    />
  ),
};
export default toastConfig;
