import supertest from "supertest";
import TestAgent from "supertest/lib/agent";
import { afterAll, beforeAll, beforeEach, expect, it } from "vitest";

import { start } from "@/app";
import { loginUser, logoutUser } from "@tests/lib/session";

let agent: TestAgent;
let app: Awaited<ReturnType<typeof start>>;

beforeAll(async () => {
  app = await start();
  agent = supertest.agent(app.fastify.server);
});

afterAll(async () => {
  await app.dispose();
});

// make sure tests are isolated
beforeEach(async () => {
  await logoutUser(agent);
});

it("should not include user session when uninitialized", async () => {
  const response = await agent.get("/session").expect(200);

  expect(response.headers["set-cookie"]).toBeFalsy();
});

it("should not be authenticated by default", async () => {
  const response = await agent.get("/session").expect(200);

  expect(response.body).toEqual({ authenticated: false });
});

it("should return authenticated after login", async () => {
  await loginUser(agent);

  const sessionResponse = await agent.get("/session").expect(200);
  expect(sessionResponse.body).toEqual({ authenticated: true });
});

it("should return unauthenticated after logout", async () => {
  //login
  await loginUser(agent);

  //logout
  await logoutUser(agent);

  const response = await agent.get("/session").expect(200);
  expect(response.body).toEqual({ authenticated: false });
});
