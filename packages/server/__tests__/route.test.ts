import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { start } from "@/app";

let app: Awaited<ReturnType<typeof start>>;
beforeAll(async () => {
  app = await start();
});

describe("test routes", async () => {
  it("GET / route", async () => {
    const { fastify } = app;
    const response = await supertest(fastify.server).get("/").expect(200);

    expect(response.body).toEqual({ status: "OK" });
  });
});

afterAll(async () => {
  await app.dispose();
});
