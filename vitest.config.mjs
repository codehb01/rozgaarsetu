import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // Run tests in Node environment (no browser needed for unit tests)
    environment: "node",
    // Glob for test files
    include: ["tests/**/*.test.ts"],
    // Coverage config (optional but wired up for later)
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["lib/**/*.ts"],
      exclude: ["lib/prisma.ts"],
    },
  },
  resolve: {
    alias: {
      // Mirror the @/* alias from tsconfig.json
      "@": path.resolve(import.meta.dirname, "./"),
    },
  },
});
