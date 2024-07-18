import { Address } from "abitype";
import TestAgent from "supertest/lib/agent";
import { Hex } from "viem";

import { getSystemId } from "@tests/lib/common";
import { TEST_WORLD_ABI, TEST_WORLD_ADDRESS } from "@tests/lib/constants";
import { encodeSystemCallFrom } from "@tests/lib/encode";

async function submit(agent: TestAgent, params: Awaited<ReturnType<typeof encodeSystemCallFrom>>) {
  const res = await agent.post("/call").send({ params, worldAddress: TEST_WORLD_ADDRESS }).expect(200);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return res.body.txHash as Hex;
}

export async function move(agent: TestAgent, from: Address, coord: { x: number; y: number }) {
  const params = await encodeSystemCallFrom({
    abi: TEST_WORLD_ABI,
    functionName: "move",
    args: [coord.x, coord.y],
    systemId: getSystemId("TestSystem"),
    from,
  });

  return await submit(agent, params);
}
