import { vi } from 'vitest';

// Mock React Native modules
vi.mock('react-native', async () => {
  const actual = await vi.importActual('react-native');
  return {
    ...actual,
    Appearance: {
      getColorScheme: vi.fn(() => 'light'),
      addChangeListener: vi.fn(() => ({ remove: vi.fn() })),
    },
  };
});

// Mock Expo modules
vi.mock('expo-router', () => ({
  router: {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  },
  Link: ({ children }) => children,
}));

vi.mock('@expo/vector-icons/', () => ({
  Feather: ({ name, size, color }) => `Icon(${name})`,
}));

// Mock Expo constants
vi.mock('expo-constants', () => ({
  default: {
    expoVersion: '51.0.0',
  },
}));

// Mock AsyncStorage for any context that might use it
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
}));

// Global test setup
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};
