import { expect, it } from "vitest";

import { move } from "@tests/lib/calls.ts";
import { createHttpAgent, createUserWallet, randomCoord } from "@tests/lib/common";
import { fetchUserPosition } from "@tests/lib/fetch";
import { loginUser, logoutUser } from "@tests/lib/session";

it("should move the user to random position", async () => {
  const user = createUserWallet();
  const agent = createHttpAgent();

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

const COUNT = 100;
it(`should move ${COUNT} users correctly with random position`, async () => {
  const users = Array.from({ length: COUNT }, () => createUserWallet());
  const agents = Array.from({ length: COUNT }, () => createHttpAgent());

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
      await logoutUser(agent);
    }),
  );
});

it("should move user with a timebound delegation", async () => {
  const user = createUserWallet();
  const agent = createHttpAgent();

  const coord = randomCoord();
  await loginUser(user, agent, 10);

  const hash = await move(agent, user.account.address, coord);
  await user.waitForTransactionReceipt({
    hash,
  });

  const result = await fetchUserPosition(user.account.address);

  expect(result).toEqual(coord);
});
