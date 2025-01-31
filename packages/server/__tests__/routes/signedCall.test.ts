import { parseEther } from "viem";
import { expect, it } from "vitest";

import { SERVER_WALLET } from "@/index";
import { CHAIN } from "@/utils/constants";
import { createHttpAgent, createUserWallet, randomCoord } from "@tests/lib/common";
import { TEST_WORLD_ADDRESS } from "@tests/lib/constants";
import { fetchUserPosition } from "@tests/lib/fetch";
import { move, sendValue, sendValueExpectRevert } from "@tests/lib/signedCall";

it("should move the user to random position using a signed transaction", async () => {
  const user = createUserWallet();
  const agent = createHttpAgent();

  // Get some random coordinates
  const coord = randomCoord();

  // Send the signed transaction to the server so it can submit it
  const hash = await move(user, agent, coord);
  await user.waitForTransactionReceipt({ hash });

  // Fetch the user's position to verify the move
  const result = await fetchUserPosition(user.account.address);
  expect(result).toEqual(coord);
});

it("should be able to send value with a signed transaction", async () => {
  const user = createUserWallet();
  const agent = createHttpAgent();
  const minDeposit = parseEther("1");

  // Get the user's balance before the transaction
  const worldBalanceBefore = await user.getBalance({ address: TEST_WORLD_ADDRESS });

  // Send the signed transaction to the server so it can submit it
  const fundHash = await SERVER_WALLET.sendTransaction({
    chain: CHAIN,
    account: SERVER_WALLET.account,
    to: user.account.address,
    value: minDeposit * 2n,
  });
  await SERVER_WALLET.waitForTransactionReceipt({ hash: fundHash });

  // Send the signed transaction to the server so it can submit it
  const hash = await sendValue(user, agent, minDeposit);
  await user.waitForTransactionReceipt({ hash });

  // Verify the value was successfully sent
  const worldBalanceAfter = await user.getBalance({ address: TEST_WORLD_ADDRESS });
  const expectedWorldBalance = worldBalanceBefore + minDeposit;
  expect(worldBalanceAfter).toEqual(expectedWorldBalance);

  // Try to submit a transaction that would revert (not enough funds)
  const response = await sendValueExpectRevert(user, agent, minDeposit - BigInt(1));
  expect(response.error).toBe("Bad Request");
  expect(response.message).toBe("Transaction reverted.");

  // Verify the world balance is still the same (it wasn't the one to actually send the value)
  expect(worldBalanceAfter).toEqual(expectedWorldBalance);
});
