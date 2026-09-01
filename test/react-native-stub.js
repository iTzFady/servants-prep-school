import { vi } from "vitest";

export const Platform = { OS: "ios" };
export const Appearance = {
  getColorScheme: vi.fn(() => "light"),
  addChangeListener: vi.fn(() => ({ remove: vi.fn() })),
};

export const View = ({ children, ...props }) => ({ children, ...props });
export const Text = ({ children, ...props }) => ({ children, ...props });
export const Pressable = ({ children, ...props }) => ({ children, ...props });
export const TouchableOpacity = ({ children, ...props }) => ({
  children,
  ...props,
});
export const ActivityIndicator = () => null;
export const ScrollView = ({ children, ...props }) => ({ children, ...props });
export const KeyboardAvoidingView = ({ children, ...props }) => ({
  children,
  ...props,
});
export const Image = ({ children, ...props }) => ({ children, ...props });
export const Alert = { alert: vi.fn() };
export const StyleSheet = { create: (styles) => styles };
export const Dimensions = { get: () => ({ width: 375, height: 812 }) };

export default {
  Platform,
  Appearance,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
};
