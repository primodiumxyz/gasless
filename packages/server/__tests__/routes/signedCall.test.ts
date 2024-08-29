import { parseEther } from "viem";
import { expect, it } from "vitest";

import { SERVER_WALLET } from "@/index";
import { chains } from "@/utils/chain";
import { CHAIN } from "@/utils/constants";
import { createHttpAgent, createUserWallet, randomCoord } from "@tests/lib/common";
import { TEST_WORLD_ADDRESS } from "@tests/lib/constants";
import { fetchUserPosition } from "@tests/lib/fetch";
import { move, sendValue, sendValueExpectRevert } from "@tests/lib/signedCall";

it("should move the user to random position using a signed transaction", async () => {
  const user = createUserWallet();
  const agent = createHttpAgent();
  const coord = randomCoord();

  const hash = await move(user, agent, coord);
  await user.waitForTransactionReceipt({ hash });

  const result = await fetchUserPosition(user.account.address);
  expect(result).toEqual(coord);
});

it("should be able to send value with a signed transaction", async () => {
  const user = createUserWallet();
  const agent = createHttpAgent();
  const minDeposit = parseEther("1");

  const worldBalanceBefore = await user.getBalance({ address: TEST_WORLD_ADDRESS });
  const fundHash = await SERVER_WALLET.sendTransaction({
    chain: chains[CHAIN],
    account: SERVER_WALLET.account,
    to: user.account.address,
    value: minDeposit * 2n,
  });
  await SERVER_WALLET.waitForTransactionReceipt({ hash: fundHash });

  console.log(await user.getBalance({ address: SERVER_WALLET.account.address }));

  // Successfully send value
  const hash = await sendValue(user, agent, minDeposit);
  await user.waitForTransactionReceipt({ hash });

  const worldBalanceAfter = await user.getBalance({ address: TEST_WORLD_ADDRESS });
  const expectedWorldBalance = worldBalanceBefore + minDeposit;
  expect(worldBalanceAfter).toEqual(expectedWorldBalance);

  // Revert
  const response = await sendValueExpectRevert(user, agent, minDeposit - BigInt(1));
  expect(response.error).toBe("Bad Request");
  expect(response.message).toBe("Transaction reverted.");

  expect(worldBalanceAfter).toEqual(expectedWorldBalance);
});
