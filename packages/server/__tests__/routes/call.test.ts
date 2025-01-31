import { expect, it } from "vitest";

import { move } from "@tests/lib/calls";
import { createHttpAgent, createUserWallet, randomCoord } from "@tests/lib/common";
import { fetchUserPosition } from "@tests/lib/fetch";
import { loginUser, logoutUser } from "@tests/lib/session";

it("should move the user to random position", async () => {
  const user = createUserWallet();
  const agent = createHttpAgent();

  // Get some random coordinates and setup delegation
  const coord = randomCoord();
  await loginUser(user, agent);

  // Send a call to move the user for the server to submit
  const hash = await move(agent, user.account.address, coord);
  await user.waitForTransactionReceipt({
    hash,
  });

  // Fetch the user's position to verify the move
  const result = await fetchUserPosition(user.account.address);
  expect(result).toEqual(coord);

  // Logout the user
  await logoutUser(agent);
});

const COUNT = 100;
it(`should move ${COUNT} users correctly with random position`, async () => {
  const users = Array.from({ length: COUNT }, () => createUserWallet());
  const agents = Array.from({ length: COUNT }, () => createHttpAgent());

  // Move each user to a random position
  await Promise.all(
    // For each user
    users.map(async (user, index) => {
      const agent = agents[index]!;
      const coord = randomCoord();

      // Login the user
      await loginUser(user, agent);

      // Send a call to move the user for the server to submit
      const hash = await move(agent, user.account.address, coord);
      await user.waitForTransactionReceipt({
        hash,
      });

      // Fetch the user's position to verify the move
      const result = await fetchUserPosition(user.account.address);
      expect(result).toEqual(coord);

      // Logout the user
      await logoutUser(agent);
    }),
  );
});

it("should move user with a timebound delegation", async () => {
  const user = createUserWallet();
  const agent = createHttpAgent();

  // Get some random coordinates and setup delegation for 10 seconds
  const coord = randomCoord();
  await loginUser(user, agent, 10);

  // Send a call to move the user for the server to submit
  const hash = await move(agent, user.account.address, coord);
  await user.waitForTransactionReceipt({
    hash,
  });

  // Fetch the user's position to verify the move
  const result = await fetchUserPosition(user.account.address);
  expect(result).toEqual(coord);

  // Logout the user
  await logoutUser(agent);
});
