import * as SecureStore from "expo-secure-store";
import type { User } from "../store/authSlice";

const USER_KEY = "authUser";
const TOKEN_KEY = "authToken";

export const secureStore = {
  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error storing token:", error);
    }
  },

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const raw = await SecureStore.getItemAsync(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch (error) {
      console.error("Error retrieving user:", error);
      return null;
    }
  },

  async setUser(user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Error storing user:", error);
    }
  },

  async removeUser(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error("Error removing user:", error);
    }
  },

  async clear(): Promise<void> {
    try {
      await Promise.all([this.removeToken(), this.removeUser()]);
    } catch (error) {
      console.error("Error clearing secure store:", error);
    }
  },
};
