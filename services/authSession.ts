import { secureStore } from "./secureStore";
import { queryClient } from "./queryClient";
import { clearAuth } from "@/store/authSlice";
import { store } from "@/store/store";
import { clearSentryUser } from "@/services/sentryClient";

export async function clearAuthSession(): Promise<void> {
  try {
    await secureStore.clear();
  } catch (error) {
    console.error("Failed to clear auth session from secure storage:", error);
  }

  try {
    queryClient.clear();
  } catch (error) {
    console.error("Failed to clear React Query cache during logout:", error);
  }

  clearSentryUser();
  store.dispatch(clearAuth());
}
