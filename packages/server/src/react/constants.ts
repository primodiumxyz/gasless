import { resourceToHex } from "@latticexyz/common";
import { createWalletClient, Hex, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { chains } from "@/utils/chain";

declare global {
  interface ImportMeta {
    env: {
      GASLESS_SERVER_CHAIN?: string;
      GASLESS_SERVER_PRIVATE_KEY?: string;
    };
  }
}

export const CHAIN = import.meta.env.GASLESS_SERVER_CHAIN ?? "dev";
export const SERVER_ACCOUNT = privateKeyToAccount(
  (import.meta.env.GASLESS_SERVER_PRIVATE_KEY ??
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80") as Hex,
);

export const SERVER_WALLET = createWalletClient({
  account: SERVER_ACCOUNT,
  transport: http(),
  chain: chains[CHAIN],
}).extend(publicActions);

export const UNLIMITED_DELEGATION = resourceToHex({ type: "system", namespace: "", name: "unlimited" });
export const TIMEBOUND_DELEGATION = resourceToHex({ type: "system", namespace: "", name: "timebound" });
export const SYSTEMBOUND_DELEGATION = resourceToHex({ type: "system", namespace: "", name: "systembound" });
