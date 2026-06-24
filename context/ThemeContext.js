import { Colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance } from "react-native";

export const ThemeContext = createContext(null);

const THEME_STORAGE_KEY = "APP_THEME";

export function ThemeProvider({ children }) {
  const [colorScheme, setColorSchemeState] = useState(null);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

      if (savedTheme === "light" || savedTheme === "dark") {
        setColorSchemeState(savedTheme);
      } else {
        setColorSchemeState(Appearance.getColorScheme() ?? "light");
      }
    } catch (error) {
      Sentry.captureException(new Error(error));

      setColorSchemeState(Appearance.getColorScheme() ?? "light");
    }
  };

  const setColorScheme = useCallback(async (scheme) => {
    try {
      setColorSchemeState(scheme);

      await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
    } catch (error) {
      Sentry.captureException(new Error(error));
    }
  }, []);

  const theme = useMemo(
    () => (colorScheme === "light" ? Colors.light : Colors.dark),
    [colorScheme],
  );

  if (!colorScheme) return null;

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        setColorScheme,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
