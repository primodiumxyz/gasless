import { createWalletClient, http, publicActions } from "viem";
import { Address, privateKeyToAccount } from "viem/accounts";
import { foundry } from "viem/chains";

import { calderaSepolia } from "@/utils/chain";

export const DEV = process.env.NODE_ENV === "development";
export const PROD = process.env.NODE_ENV === "production";
export const TEST = process.env.NODE_ENV === "test";

export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const PORT = parseInt(process.env.PORT!);

export const SERVER_ACCOUNT = privateKeyToAccount(process.env.PRIVATE_KEY! as Address);
export const WALLET = createWalletClient({
  account: SERVER_ACCOUNT,
  transport: http(),
  chain: PROD ? calderaSepolia : foundry,
}).extend(publicActions);
