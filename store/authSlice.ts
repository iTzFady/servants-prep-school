import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  prepYear: number;
  gender: string;
  pfpUrl: string;
  role: string;
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Logout
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    // Initialize auth (from SecureStore)
    initializeAuth: (
      state,
      action: PayloadAction<{ token: string | null; user: User | null }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.token;
    },
  },
});

export const {
  setUser,
  setToken,
  setAuthLoading,
  setAuthError,
  clearAuth,
  initializeAuth,
} = authSlice.actions;
export default authSlice.reducer;
