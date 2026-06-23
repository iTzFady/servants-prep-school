import ThemedStack from "@/components/ThemedStack";
import Toast from "react-native-toast-message";
import { ThemeProvider } from "@/context/ThemeContext";
import {
  Cairo_200ExtraLight,
  Cairo_300Light,
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from "@expo-google-fonts/cairo";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppProviders from "@/providers/AppProviders";
import toastConfig from "@/theme/toast";
import "../global.css";
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Cairo_200ExtraLight,
    Cairo_300Light,
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  useEffect(() => {
    SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#A71E34" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AppProviders>
          <ThemedStack />
        </AppProviders>
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
