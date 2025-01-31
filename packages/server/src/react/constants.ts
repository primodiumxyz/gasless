import { resourceToHex } from "@latticexyz/common";
import { createWalletClient, Hex, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { ChainName, chains } from "@/utils/chain";

declare global {
  interface ImportMeta {
    env: {
      GASLESS_SERVER_CHAIN?: string;
      GASLESS_SERVER_PRIVATE_KEY?: string;
    };
  }
}

// Validate the chain name
const chainName = import.meta.env.GASLESS_SERVER_CHAIN ?? "foundry";
if (!(chainName in chains)) {
  throw new Error(`Invalid chain name: ${chainName}; this is not a chain supported by viem`);
}

/**
 * The viem chain to use for the server.
 *
 * Note: The chain is read from the environment.
 */
export const CHAIN = chains[chainName as ChainName];

/**
 * The account to use as the server's paymaster.
 *
 * Note: The account is created from the private key read from the environment.
 */
export const SERVER_ACCOUNT = privateKeyToAccount(
  (import.meta.env.GASLESS_SERVER_PRIVATE_KEY ??
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
  chain: CHAIN,
}).extend(publicActions);

/** The resource to use for an unlimited delegation. */
export const UNLIMITED_DELEGATION = resourceToHex({ type: "system", namespace: "", name: "unlimited" });

/** The resource to use for a time-bound delegation. */
export const TIMEBOUND_DELEGATION = resourceToHex({ type: "system", namespace: "", name: "timebound" });

/** The resource to use for a system-bound delegation. */
export const SYSTEMBOUND_DELEGATION = resourceToHex({ type: "system", namespace: "", name: "systembound" });
