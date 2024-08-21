import { Redis } from "ioredis";
import RedisMock from "ioredis-mock";
import { createWalletClient, Hex, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { chains } from "@/utils/chain";

export const DEV = process.env.NODE_ENV === "development";
export const PROD = process.env.NODE_ENV === "production";
export const TEST = process.env.NODE_ENV === "test";

export const SESSION_SECRET = process.env.SESSION_SECRET ?? "pqu3QS3OUB9tIiWntAEI7PkaIfp2H73Me2Lqq340FXc2";
export const PORT = parseInt(process.env.PORT ?? "3000");
export const CHAIN = process.env.CHAIN ?? "foundry";

export const SERVER_ACCOUNT = privateKeyToAccount(
  (process.env.PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80") as Hex,
);
export const WALLET = createWalletClient({
  account: SERVER_ACCOUNT,
  transport: http(),
  chain: chains[CHAIN],
}).extend(publicActions);

export const REDIS = PROD ? new Redis() : new RedisMock();
