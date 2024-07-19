/// <reference types="vitest" />
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["./__tests__/**/*.test.ts"],
    forceRerunTriggers: ["**/*.ts"],
    silent: false,
    reporters: ["verbose"],
    testTimeout: 50_000,
    globalSetup: ["./__tests__/globalSetup/setupServer.ts"],
    sequence: {
      concurrent: true,
    },
    server: {
      deps: {
        inline: ["@fastify/autoload"],
      },
    },
  },
  plugins: [tsconfigPaths()],
});
