import { describe, expect, it } from "vitest";

import { build } from "@/app";

describe("correctly loads and requires env vars", async () => {
  it("should contain config vars with values", async () => {
    const fastify = await build();
    expect(fastify.config).toBeDefined();
    expect(fastify.config).toHaveProperty("PORT", 3000);
    expect(fastify.config).toHaveProperty("PRIVATE_KEY", "0x123");
    expect(fastify.config).toHaveProperty("NODE_ENV", "test");
  });
});
