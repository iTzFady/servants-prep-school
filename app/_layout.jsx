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
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppProvidersRoot from "@/providers/AppProviders";
import toastConfig from "@/theme/toast";
import * as Sentry from "@sentry/react-native";
import { initializeSentry } from "@/services/sentryClient";
import AppSplashScreen from "@/components/AppSplashScreen";
import "../global.css";

SplashScreen.preventAutoHideAsync().catch(() => undefined);
initializeSentry();

export default Sentry.wrap(function RootLayout() {
  const [loaded, error] = useFonts({
    Cairo_200ExtraLight,
    Cairo_300Light,
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return <AppSplashScreen />;
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AppProvidersRoot>
          <ThemedStack />
        </AppProvidersRoot>
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </ThemeProvider>
  );
});
