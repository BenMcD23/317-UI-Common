import { defineConfig } from "vitest/config";

// Same rules as the two apps: Node by default, a DOM only for tests that ask
// with `// @vitest-environment jsdom`, and nothing carried between tests.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
});
