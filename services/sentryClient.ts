import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

export const initializeSentry = () => {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT || "development",
    tracesSampleRate: parseFloat(
      process.env.EXPO_PUBLIC_SENTRY_TRACE_SAMPLE_RATE || "1.0",
    ),
    enabled: !!process.env.EXPO_PUBLIC_SENTRY_DSN,
    // Release information
    release: Constants.expoConfig?.version, // Ignore specific errors that are not critical
    ignoreErrors: [
      // Network errors that shouldn't trigger alerts
      "Network request failed",
      "ECONNABORTED",
      "ETIMEDOUT",
      // React Navigation errors
      "Cannot update a component",
    ],
    // Configure what data is sent to Sentry
    beforeSend(event) {
      // Filter out certain errors in development
      if (process.env.NODE_ENV === "development") {
        console.log("[Sentry] Captured event:", event);
      }
      return event;
    },
  });
};

// Helper function to capture exception with additional context
export const captureException = (
  error: Error,
  context?: Record<string, any>,
) => {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
};

// Helper function to capture messages
export const captureMessage = (
  message: string,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
) => {
  Sentry.captureMessage(message, level);
};

// Helper function to add breadcrumb
export const addBreadcrumb = (
  message: string,
  data?: Record<string, any>,
  category: string = "user-action",
) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level: "info",
    data,
  });
};

// Helper function to set user context
export const setSentryUser = (
  userId: string,
  userData?: Record<string, any>,
) => {
  Sentry.setUser({
    id: userId,
    ...userData,
  });
};

// Helper function to clear user context
export const clearSentryUser = () => {
  Sentry.setUser(null);
};
