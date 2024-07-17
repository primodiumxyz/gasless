import { Address } from "abitype";
import TestAgent from "supertest/lib/agent";

import { getSystemId } from "@tests/lib/common";
import { TEST_ABI, TEST_WORLD_ADDRESS } from "@tests/lib/constants";
import { encodeSystemCallFrom } from "@tests/lib/encode";

async function submit(agent: TestAgent, params: Awaited<ReturnType<typeof encodeSystemCallFrom>>) {
  const res = await agent.post("/call").send({ params, worldAddress: TEST_WORLD_ADDRESS }).expect(200);

  return res;
}

export async function move(agent: TestAgent, from: Address, coord: { x: number; y: number }) {
  const params = await encodeSystemCallFrom({
    abi: TEST_ABI,
    functionName: "move",
    args: [coord.x, coord.y],
    systemId: getSystemId("TestSystem"),
    from,
  });

  return await submit(agent, params);
}
