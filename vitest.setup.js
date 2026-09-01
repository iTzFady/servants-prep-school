import { vi } from "vitest";

vi.mock("react-native", () => ({
  Platform: { OS: "ios" },
  Appearance: {
    getColorScheme: vi.fn(() => "light"),
    addChangeListener: vi.fn(() => ({ remove: vi.fn() })),
  },
  View: ({ children }) => children,
  Text: ({ children }) => children,
  Pressable: ({ children, onPress, ...props }) => ({
    children,
    onPress,
    ...props,
  }),
  TouchableOpacity: ({ children, ...props }) => ({ children, ...props }),
  StyleSheet: { create: (styles) => styles },
  ActivityIndicator: () => null,
}));

vi.mock("expo-router", () => ({
  router: {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    dismissAll: vi.fn(),
    navigate: vi.fn(),
  },
  Link: ({ children }) => children,
}));

vi.mock("react-native-toast-message", () => ({
  default: {
    show: vi.fn(),
  },
}));

vi.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

vi.mock("@expo/vector-icons/", () => ({
  Feather: ({ name }) => `Icon(${name})`,
  AntDesign: ({ name }) => `Icon(${name})`,
  MaterialIcons: ({ name }) => `Icon(${name})`,
  SimpleLineIcons: ({ name }) => `Icon(${name})`,
}));

vi.mock("@sentry/react-native", () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  init: vi.fn(),
  withScope: vi.fn(),
  setUser: vi.fn(),
  configureScope: vi.fn(),
  addBreadcrumb: vi.fn(),
}));

vi.mock("expo-constants", () => ({
  default: {
    expoVersion: "51.0.0",
    expoConfig: { extra: { eas: { projectId: "test-project-id" } } },
    easConfig: { projectId: "test-project-id" },
  },
}));

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
}));

global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};
