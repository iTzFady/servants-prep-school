import { createContext, useMemo, useState } from "react";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [colorScheme, setColorSchemeState] = useState("light");
  const theme = useMemo(
    () => ({
      background: "#ffffff",
      text: "#111827",
      title: "#111827",
      settings: {
        section: { title: "#6b7280", background: "#f3f4f6" },
        button: "#f3f4f6",
      },
      inputField: { color: "#111827" },
    }),
    [],
  );

  const setColorScheme = (scheme) => setColorSchemeState(scheme);

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
