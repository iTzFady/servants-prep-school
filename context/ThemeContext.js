import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import { Appearance } from "react-native";

export const ThemeContext = createContext(null);

const THEME_STORAGE_KEY = "APP_THEME";

export function ThemeProvider({ children }) {
  const [colorScheme, setColorSchemeState] = useState(
    () => Appearance.getColorScheme() ?? "light",
  );

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((savedTheme) => {
        if (!active) return;

        if (savedTheme === "light" || savedTheme === "dark") {
          setColorSchemeState(savedTheme);
          return;
        }

        setColorSchemeState(Appearance.getColorScheme() ?? "light");
      })
      .catch((error) => {
        if (!active) return;
        Sentry.captureException(new Error(error));
        setColorSchemeState(Appearance.getColorScheme() ?? "light");
      });

    return () => {
      active = false;
    };
  }, []);

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

  if (!colorScheme) {
    return null;
  }

  return React.createElement(
    ThemeContext.Provider,
    {
      value: {
        colorScheme,
        setColorScheme,
        theme,
      },
    },
    children,
  );
}
