import { resourceToHex } from "@latticexyz/common";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";
import {
  Chain,
  createWalletClient,
  Hex,
  http,
  HttpTransport,
  PrivateKeyAccount,
  PublicActions,
  publicActions,
  WalletClient,
} from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { foundry } from "viem/chains";

import { TEST_SERVER_ENDPOINT } from "@tests/lib/constants";

/**
 * Get the system ID for a given system name and namespace.
 *
 * @param name - The name of the system
 * @param namespace (optional) - The namespace of the system
 * @returns {Hex} - The system ID
 */
export function getSystemId(name: string, namespace = ""): Hex {
  return resourceToHex({ type: "system", name, namespace });
}

type Coord = {
  x: number;
  y: number;
};

/**
 * Generate a random coordinate.
 *
 * @returns {Coord} - The coordinate
 */
export function randomCoord(): Coord {
  return { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) };
}

/**
 * Sleep for a given number of milliseconds.
 *
 * @param ms - The number of milliseconds to sleep
 * @returns {Promise<void>} - A promise that resolves when the sleep is complete
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type UserWallet = WalletClient<HttpTransport, Chain, PrivateKeyAccount> & PublicActions;
/**
 * Create a wallet client for a random account.
 *
 * @returns {UserWallet} - The wallet client
 */
export function createUserWallet(): UserWallet {
  const account = privateKeyToAccount(generatePrivateKey());
  const walletClient = createWalletClient({
    account,
    transport: http(),
    chain: foundry,
    pollingInterval: 1_000,
  }).extend(publicActions);

  return walletClient;
}

/**
 * Create an HTTP agent for testing.
 *
 * @returns {TestAgent} - The HTTP agent
 */
export function createHttpAgent(): TestAgent {
  return supertest.agent(TEST_SERVER_ENDPOINT);
}
