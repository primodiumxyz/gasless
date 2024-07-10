/// <reference types="vitest" />
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["./__tests__/**/*.test.ts"],
    forceRerunTriggers: ["**/*.ts"],
    silent: false,
    reporters: ["verbose"],
    // for testing locally and in CI
    env: {
      PRIVATE_KEY: "0x123",
      PORT: "3000",
      SESSION_SECRET: "pqu3QS3OUB9tIiWntAEI7PkaIfp2H73Me2Lqq340FXc2",
    },
    server: {
      deps: {
        inline: ["@fastify/autoload"],
      },
    },
  },
  plugins: [tsconfigPaths()],
});
