import TestAgent from "supertest/lib/agent";
import { Chain, encodeFunctionData, Hex, HttpTransport, PrivateKeyAccount, WalletClient } from "viem";
import { getTransactionCount } from "viem/actions";
import { expect } from "vitest";

import { getSystemId } from "@tests/lib/common";
import { TEST_WORLD_ABI, TEST_WORLD_ADDRESS } from "@tests/lib/constants";
import { encodeSystemCall } from "@tests/lib/encode";

/**
 * Move a user to a given coordinate.
 *
 * @param user - The wallet client for the user
 * @param agent - The HTTP agent
 * @param coord - The coordinate to move to
 * @returns {Promise<Hex>} - The transaction hash
 */
export async function move<T extends WalletClient<HttpTransport, Chain, PrivateKeyAccount>>(
  user: T,
  agent: TestAgent,
  coord: { x: number; y: number },
): Promise<Hex> {
  const [systemId, callData] = await encodeSystemCall({
    abi: TEST_WORLD_ABI,
    functionName: "move",
    args: [coord.x, coord.y],
    systemId: getSystemId("TestSystem"),
  });

  const signedTx = await user.signTransaction({
    to: TEST_WORLD_ADDRESS,
    type: "legacy",
    gas: 1_000_000n,
    data: encodeFunctionData({
      abi: TEST_WORLD_ABI,
      functionName: "call",
      args: [systemId, callData],
    }),
  });

  const response = await agent.post("/signedCall").send({ signature: signedTx }).expect(200);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(response.body.txHash).toMatch(/^0x[a-fA-F0-9]+$/);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.body.txHash as Hex;
}

type SendValueResponse = ReturnType<TestAgent["POST"]>;

/**
 * Send a transaction containing native tokens to a wallet.
 *
 * @param user - The wallet client for the user
 * @param agent - The HTTP agent
 * @param amount - The amount to send
 * @returns {Promise<SendValueResponse>} - The response from the server
 */
async function _sendValue<T extends WalletClient<HttpTransport, Chain, PrivateKeyAccount>>(
  user: T,
  agent: TestAgent,
  amount: bigint,
  shouldRevert: boolean = false,
): Promise<SendValueResponse> {
  const [systemId, callData] = await encodeSystemCall({
    abi: TEST_WORLD_ABI,
    functionName: "deposit",
    args: [],
    systemId: getSystemId("TestSystem"),
  });

  // we can't use `user.prepareTransactionRequest()` to determine the type, gas, nonce
  // because it might fail if the user doesn't have enough for gas...
  // ... which is not relevant because they won't pay for it
  const signedTx = await user.signTransaction({
    to: TEST_WORLD_ADDRESS,
    value: amount,
    type: "eip1559",
    gas: 1_000_000n,
    nonce: await getTransactionCount(user, { address: user.account.address }),
    data: encodeFunctionData({
      abi: TEST_WORLD_ABI,
      functionName: "call",
      args: [systemId, callData],
    }),
  });

  return await agent
    .post("/signedCall")
    .send({ signature: signedTx })
    .expect(shouldRevert ? 400 : 200);
}

/**
 * Send a transaction containing native tokens to a wallet.
 *
 * @param user - The wallet client for the user
 * @param agent - The HTTP agent
 * @param amount - The amount to send
 * @returns {Promise<Hex>} - The transaction hash
 */
export async function sendValue<T extends WalletClient<HttpTransport, Chain, PrivateKeyAccount>>(
  user: T,
  agent: TestAgent,
  amount: bigint,
): Promise<Hex> {
  const response = await _sendValue(user, agent, amount);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(response.body.txHash).toMatch(/^0x[a-fA-F0-9]+$/);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.body.txHash as Hex;
}

type SendValueExpectRevertResponse = {
  error: string;
  message: string;
};

/**
 * Send a transaction containing native tokens to a wallet and expect it to revert.
 *
 * @param user - The wallet client for the user
 * @param agent - The HTTP agent
 * @param amount - The amount to send
 * @returns {Promise<SendValueExpectRevertResponse>} - The response from the server
 */
export async function sendValueExpectRevert<T extends WalletClient<HttpTransport, Chain, PrivateKeyAccount>>(
  user: T,
  agent: TestAgent,
  amount: bigint,
): Promise<SendValueExpectRevertResponse> {
  const response = await _sendValue(user, agent, amount, true);
  return response.body as SendValueExpectRevertResponse;
}
