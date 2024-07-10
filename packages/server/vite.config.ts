/// <reference types="vitest" />
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["./__tests__/**/*.test.ts"],
    forceRerunTriggers: ["**/*.ts"],
    silent: false,
    reporters: ["verbose"],
    // env to test
    env: {
      NODE_ENV: "test",
      PORT: "3000",
      PRIVATE_KEY: "0x123",
    },
    server: {
      deps: {
        inline: ["@fastify/autoload"],
      },
    },
  },
  plugins: [tsconfigPaths()],
});
