import { Colors } from "@/theme/colors";
import { createContext, useMemo, useState } from "react";
import { Appearance } from "react-native";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [colorScheme, setColorScheme] = useState(
    Appearance.getColorScheme() ?? "light",
  );

  const theme = useMemo(
    () => (colorScheme === "light" ? Colors.dark : Colors.light),
    [colorScheme],
  );

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
