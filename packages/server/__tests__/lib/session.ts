import { FastifyInstance } from "fastify";
import TestAgent from "supertest/lib/agent";
import { Address, Chain, encodeFunctionData, HttpTransport, PrivateKeyAccount, WalletClient } from "viem";
import { expect } from "vitest";

import { getSystemId } from "@tests/lib/common";
import { UNLIMITED_DELEGATION } from "@tests/lib/constants";
import { signCall } from "@tests/lib/sign";

import WorldAbi from "../../../test-contracts/out/IWorld.sol/IWorld.abi.json";
import worlds from "../../../test-contracts/worlds.json";

export async function loginUser<T extends WalletClient<HttpTransport, Chain, PrivateKeyAccount>>(
  user: T,
  agent: TestAgent,
  fastify: FastifyInstance,
) {
  const delegateCallData = encodeFunctionData({
    abi: WorldAbi,
    functionName: "registerDelegation",
    args: [fastify.config.WALLET.account.address, UNLIMITED_DELEGATION, "0x"],
  });

  const signature = await signCall({
    userClient: user,
    worldAddress: worlds[31337].address as Address,
    systemId: getSystemId("Registration"),
    callData: delegateCallData,
  });

  const response = await agent
    .post("/session")
    .send({
      address: user.account?.address,
      worldAddress: worlds[31337].address,
      callData: delegateCallData,
      systemId: getSystemId("Registration"),
      signature,
    })
    .expect(200);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(response.body.authenticated).toBe(true);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(response.body.txHash).toMatch(/^0x[a-fA-F0-9]+$/);

  return response;
}

export async function logoutUser(agent: TestAgent) {
  const response = await agent.delete("/session").expect(200);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(response.body.authenticated).toBe(false);

  return response;
}
