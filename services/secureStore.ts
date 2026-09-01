import type { User } from "../store/authSlice";
import { Platform } from "react-native";

const USER_KEY = "authUser";
const TOKEN_KEY = "authToken";

// Web storage service for localStorage (web only)
const webStorage = {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Error retrieving from localStorage:", error);
      return null;
    }
  },
  setItem(key: string, value: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Error storing in localStorage:", error);
    }
  },
  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },
};

// Native storage service for SecureStore (mobile only)
let nativeStorage: any = null;
if (Platform.OS !== "web") {
  try {
    nativeStorage = require("expo-secure-store");
  } catch (e) {
    console.warn("SecureStore not available");
  }
}

// Unified storage interface
const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === "web") {
        return webStorage.getItem(key);
      } else if (nativeStorage) {
        return await nativeStorage.getItemAsync(key);
      }
      return null;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === "web") {
        webStorage.setItem(key, value);
      } else if (nativeStorage) {
        await nativeStorage.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === "web") {
        webStorage.removeItem(key);
      } else if (nativeStorage) {
        await nativeStorage.deleteItemAsync(key);
      }
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },
};

export const secureStore = {
  async getToken(): Promise<string | null> {
    return storage.getItem(TOKEN_KEY);
  },

  async setToken(token: string): Promise<void> {
    return storage.setItem(TOKEN_KEY, token);
  },

  async removeToken(): Promise<void> {
    return storage.removeItem(TOKEN_KEY);
  },

  async getUser(): Promise<User | null> {
    try {
      const raw = await storage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch (error) {
      console.error("Error parsing user:", error);
      return null;
    }
  },

  async setUser(user: User): Promise<void> {
    return storage.setItem(USER_KEY, JSON.stringify(user));
  },

  async removeUser(): Promise<void> {
    return storage.removeItem(USER_KEY);
  },

  async getItem(key: string): Promise<string | null> {
    return storage.getItem(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    return storage.setItem(key, value);
  },

  async removeItem(key: string): Promise<void> {
    return storage.removeItem(key);
  },

  async clear(): Promise<void> {
    try {
      await Promise.all([this.removeToken(), this.removeUser()]);
    } catch (error) {
      console.error("Error clearing secure store:", error);
    }
  },
};
