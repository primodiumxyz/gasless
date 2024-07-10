import supertest from "supertest";
import TestAgent from "supertest/lib/agent";
import { afterAll, beforeAll, beforeEach, expect, it } from "vitest";


import { loginUser, logoutUser } from "@tests/lib/session";
import { start } from "@/app";

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

it("should include user session in cookie header", async () => {
  const response = await agent.get("/session").expect(200);

  expect(response.headers).toHaveProperty("set-cookie");
  expect(response.headers["set-cookie"]).toBeTruthy();
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
