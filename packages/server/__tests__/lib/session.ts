import TestAgent from "supertest/lib/agent";
import { Chain, encodeFunctionData, HttpTransport, PrivateKeyAccount, WalletClient } from "viem";
import { expect } from "vitest";

import { Abi } from "@/utils/abi";
import { SERVER_WALLET, TIMEBOUND_DELEGATION, UNLIMITED_DELEGATION } from "@/utils/constants";
import { getSystemId } from "@tests/lib/common";
import { TEST_WORLD_ABI, TEST_WORLD_ADDRESS } from "@tests/lib/constants";
import { fetchSignatureNonce } from "@tests/lib/fetch";
import { signCall } from "@tests/lib/sign";

type LoginUserResponse = ReturnType<TestAgent["POST"]>;
type LogoutUserResponse = ReturnType<TestAgent["DELETE"]>;

/**
 * Login a user to the server by registering delegation.
 *
 * @param user - The wallet client for the user
 * @param agent - The HTTP agent
 * @param sessionLength - The length of the session in seconds
 * @returns {Promise<LoginUserResponse>} - The response from the server
 */
export async function loginUser<T extends WalletClient<HttpTransport, Chain, PrivateKeyAccount>>(
  user: T,
  agent: TestAgent,
  sessionLength?: number, //in seconds
): Promise<LoginUserResponse> {
  const delegateCallData = encodeFunctionData({
    abi: TEST_WORLD_ABI,
    functionName: "registerDelegation",
    args: [
      SERVER_WALLET.account.address,
      sessionLength ? TIMEBOUND_DELEGATION : UNLIMITED_DELEGATION,
      sessionLength
        ? encodeFunctionData({
            abi: Abi,
            functionName: "initDelegation",
            args: [SERVER_WALLET.account.address, BigInt(Math.floor(Date.now() / 1000) + sessionLength)],
          })
        : "0x",
    ],
  });

  const signature = await signCall({
    userClient: user,
    worldAddress: TEST_WORLD_ADDRESS,
    systemId: getSystemId("Registration"),
    callData: delegateCallData,
    nonce: await fetchSignatureNonce(user.account.address),
  });

  const response = await agent
    .post("/session")
    .send({
      address: user.account.address,
      worldAddress: TEST_WORLD_ADDRESS,
      params: [getSystemId("Registration"), delegateCallData, signature],
    })
    .expect(200);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(response.body.authenticated).toBe(true);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(response.body.txHash).toMatch(/^0x[a-fA-F0-9]+$/);

  return response;
}

/**
 * Logout a user from the server by deleting the session.
 *
 * @param agent - The HTTP agent
 * @returns {Promise<LogoutUserResponse>} - The response from the server
 */
export async function logoutUser(agent: TestAgent): Promise<LogoutUserResponse> {
  const response = await agent.delete("/session").expect(200);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(response.body.authenticated).toBe(false);

  return response;
}
