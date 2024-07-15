import { verifyTypedData } from "viem";
import { afterAll, beforeAll, expect, it } from "vitest";

import { start } from "@/app";

let app: Awaited<ReturnType<typeof start>>;
beforeAll(async () => {
  app = await start();
});

it("test", async () => {
  const { fastify } = app;
  const walletClient = fastify.config.WALLET;

  const message = {
    signer: walletClient.account.address,
    systemNamespace: "system",
    systemName: "call",
    callData: "0x",
    nonce: 0n,
  } as const;

  const types = {
    Call: [
      { name: "signer", type: "address" },
      { name: "systemNamespace", type: "string" },
      { name: "systemName", type: "string" },
      { name: "callData", type: "bytes" },
      { name: "nonce", type: "uint256" },
    ],
  } as const;

  const signature = await walletClient.signTypedData({
    primaryType: "Call",
    domain: {
      name: walletClient.chain.name,
      version: "1",
    },
    types,
    message,
  });

  const valid = await verifyTypedData({
    address: walletClient.account.address,
    primaryType: "Call",
    domain: {
      name: walletClient.chain.name,
      version: "1",
    },
    types,
    message,
    signature,
  });

  console.log(signature);

  expect(valid).toBe(true);
});

afterAll(async () => {
  await app.dispose();
});
