import { Address } from "abitype";
import TestAgent from "supertest/lib/agent";
import { Hex } from "viem";

import { getSystemId } from "@tests/lib/common";
import { TEST_WORLD_ABI, TEST_WORLD_ADDRESS } from "@tests/lib/constants";
import { encodeSystemCallFrom } from "@tests/lib/encode";

/**
 * Submit a system call to the server.
 *
 * Note: The user has to register delegation through the `/route` endpoint in order to submit calls through this
 * endpoint.
 *
 * @param agent - The test agent
 * @param params - The parameters for the system call
 * @returns {Promise<Hex>} - The transaction hash
 */
async function submit(agent: TestAgent, params: Awaited<ReturnType<typeof encodeSystemCallFrom>>): Promise<Hex> {
  const res = await agent.post("/call").send({ params, worldAddress: TEST_WORLD_ADDRESS }).expect(200);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return res.body.txHash as Hex;
}

/**
 * Submit a system call to move a user to a given coordinate.
 *
 * @param agent - The test agent
 * @param from - The address of the user
 * @param coord - The coordinate to move to
 * @returns {Promise<Hex>} - The transaction hash
 */
export async function move(agent: TestAgent, from: Address, coord: { x: number; y: number }): Promise<Hex> {
  const params = await encodeSystemCallFrom({
    abi: TEST_WORLD_ABI,
    functionName: "move",
    args: [coord.x, coord.y],
    systemId: getSystemId("TestSystem"),
    from,
  });

  return await submit(agent, params);
}
