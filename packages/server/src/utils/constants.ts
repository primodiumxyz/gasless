import { resolve } from "path";
import { resourceToHex } from "@latticexyz/common";
import { config } from "dotenv";
import { Redis } from "ioredis";
import RedisMock from "ioredis-mock";
import { createWalletClient, Hex, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { chains } from "@/utils/chain";

config({ path: resolve(process.cwd(), ".env") });

/**
 * Whether the server is in development mode.
 *
 * Note: This is read from the environment (NODE_ENV = "development").
 */
export const DEV = process.env.NODE_ENV === "development";

/**
 * Whether the server is in production mode.
 *
 * Note: This is read from the environment (NODE_ENV = "production").
 */
export const PROD = process.env.NODE_ENV === "production";

/**
 * Whether the server is in test mode.
 *
 * Note: This is read from the environment (NODE_ENV = "test").
 */
export const TEST = process.env.NODE_ENV === "test";

/**
 * The secret to use for the session.
 *
 * Note: This is read from the environment.
 */
export const SESSION_SECRET =
  process.env.GASLESS_SERVER_SESSION_SECRET ?? "pqu3QS3OUB9tIiWntAEI7PkaIfp2H73Me2Lqq340FXc2";

/**
 * The port to use for the server.
 *
 * Note: This is read from the environment.
 */
export const PORT = parseInt(process.env.GASLESS_SERVER_PORT ?? "3000");

/**
 * The chain to use for the server.
 *
 * Note: This is read from the environment.
 */
export const CHAIN = process.env.GASLESS_SERVER_CHAIN ?? "dev";

/**
 * The account to use as the server's paymaster.
 *
 * Note: The account is created from the private key read from the environment.
 */
export const SERVER_ACCOUNT = privateKeyToAccount(
  (process.env.GASLESS_SERVER_PRIVATE_KEY ??
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80") as Hex,
);

/**
 * The wallet client to use for the server's paymaster account.
 *
 * Note: The wallet client is created from the account and the chain.
 */
export const SERVER_WALLET = createWalletClient({
  account: SERVER_ACCOUNT,
  transport: http(),
  chain: chains[CHAIN],
  pollingInterval: 1_000,
}).extend(publicActions);

/**
 * The Redis client to use for the server.
 *
 * Note: It will create a mock Redis client in development mode.
 */
export const REDIS = PROD ? new Redis() : new RedisMock();

/** The resource to use for an unlimited delegation. */
export const UNLIMITED_DELEGATION = resourceToHex({ type: "system", namespace: "", name: "unlimited" });

/** The resource to use for a time-bound delegation. */
export const TIMEBOUND_DELEGATION = resourceToHex({ type: "system", namespace: "", name: "timebound" });

/** The resource to use for a system-bound delegation. */
export const SYSTEMBOUND_DELEGATION = resourceToHex({ type: "system", namespace: "", name: "systembound" });
