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
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // for testing locally and in CI
    env: {
      PORT: "3000",
      SESSION_SECRET: "pqu3QS3OUB9tIiWntAEI7PkaIfp2H73Me2Lqq340FXc2",
      PRIVATE_KEY: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    },
    server: {
      deps: {
        inline: ["@fastify/autoload"],
      },
    },
  },
  plugins: [tsconfigPaths()],
});
