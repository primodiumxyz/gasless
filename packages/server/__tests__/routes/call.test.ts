import supertest from "supertest";
import { afterAll, beforeAll, expect, it } from "vitest";

import { start } from "@/app";
import { move } from "@tests/lib/calls.ts";
import { randomCoord } from "@tests/lib/common";
import { fetchUserPosition } from "@tests/lib/fetch";
import { loginUser, logoutUser } from "@tests/lib/session";
import { createUserWallet } from "@tests/lib/wallet";

let app: Awaited<ReturnType<typeof start>>;

beforeAll(async () => {
  app = await start();
});

afterAll(async () => {
  await app.dispose();
});

it("it should move the user to random position", async () => {
  const user = createUserWallet();
  const agent = supertest.agent(app.fastify.server);
  const coord = randomCoord();
  await loginUser(user, agent);

  const hash = await move(agent, user.account.address, coord);
  await user.waitForTransactionReceipt({
    hash,
  });

  const result = await fetchUserPosition(user.account.address);

  expect(result).toEqual(coord);

  await logoutUser(agent);
});

it("should move 10 users correctly with random position", async () => {
  const users = Array.from({ length: 10 }, () => createUserWallet());
  const agents = Array.from({ length: 10 }, () => supertest.agent(app.fastify.server));

  await Promise.all(
    users.map(async (user, index) => {
      const agent = agents[index]!;
      const coord = randomCoord();

      await loginUser(user, agent);

      const hash = await move(agent, user.account.address, coord);
      await user.waitForTransactionReceipt({
        hash,
      });

      const result = await fetchUserPosition(user.account.address);

      expect(result).toEqual(coord);
    }),
  );

  // need to move out here for some reason for supertest not to error
  for (const agent of agents) {
    await logoutUser(agent);
  }
});
