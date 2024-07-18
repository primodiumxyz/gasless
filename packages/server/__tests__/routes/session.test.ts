import supertest from "supertest";
import TestAgent from "supertest/lib/agent";
import { afterAll, beforeAll, beforeEach, expect, it } from "vitest";

import { start } from "@/app";
import { loginUser, logoutUser } from "@tests/lib/session";
import { createUserWallet } from "@tests/lib/wallet";

let agent: TestAgent;
let app: Awaited<ReturnType<typeof start>>;
let user: ReturnType<typeof createUserWallet>;

beforeAll(async () => {
  app = await start();
  agent = supertest.agent(app.fastify.server);
});

afterAll(async () => {
  await app.dispose();
});

// make sure tests are isolated
beforeEach(async () => {
  user = createUserWallet();
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
  await loginUser(user, agent);

  //check response again for sanity
  const response = await agent.get("/session").expect(200);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(response.body.authenticated).toBe(true);
});

it("should return unauthenticated after logout", async () => {
  //login
  await loginUser(user, agent);

  //logout
  await logoutUser(agent);

  //check response again for sanity
  const response = await agent.get("/session").expect(200);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(response.body.authenticated).toBe(false);
});
