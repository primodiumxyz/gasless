import { afterEach } from "node:test";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";
import { afterAll, beforeAll, beforeEach, expect, it } from "vitest";

import { start } from "@/app";
import { move } from "@tests/lib/calls.ts";
import { fetchUserPosition } from "@tests/lib/fetch";
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

beforeEach(async () => {
  user = createUserWallet();
  await loginUser(user, agent);
});

afterEach(async () => {
  await logoutUser(agent);
});

it("it should move the user to (1,5)", async () => {
  await move(agent, user.account.address, { x: 1, y: 5 });

  const result = await fetchUserPosition(user.account.address);

  expect(result).toEqual({ x: 1, y: 5 });
});
