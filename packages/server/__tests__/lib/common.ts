import { resourceToHex } from "@latticexyz/common";
import supertest from "supertest";
import { createWalletClient, Hex, http, publicActions } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { foundry } from "viem/chains";

import { TEST_SERVER_ENDPOINT } from "@tests/lib/constants";

export function getSystemId(name: string, namespace = ""): Hex {
  return resourceToHex({ type: "system", name, namespace });
}

export function randomCoord() {
  return { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) };
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createUserWallet() {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  const walletClient = createWalletClient({
    account,
    transport: http(),
    chain: foundry,
  }).extend(publicActions);

  return walletClient;
}

export function createHttpAgent() {
  return supertest.agent(TEST_SERVER_ENDPOINT);
}
