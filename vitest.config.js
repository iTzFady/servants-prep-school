import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const projectRoot = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "vitest.setup.js"],
    },
  },
  resolve: {
    alias: {
      "@": projectRoot,
      "@/context/ThemeContext": fileURLToPath(
        new URL("./test/theme-context-stub.js", import.meta.url),
      ),
      "react-native": fileURLToPath(
        new URL("./test/react-native-stub.js", import.meta.url),
      ),
      "react-native-safe-area-context": fileURLToPath(
        new URL(
          "./test/react-native-safe-area-context-stub.js",
          import.meta.url,
        ),
      ),
      "react-native-toast-message": fileURLToPath(
        new URL("./test/react-native-toast-message-stub.js", import.meta.url),
      ),
    },
  },
});
