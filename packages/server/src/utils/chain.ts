import { Chain } from "viem";
import * as _chains from "viem/chains";

// Chains supported by viem
export const supportedChains = Object.keys(_chains) as (keyof typeof _chains)[];

// Type alias for chain names
export type ChainName = (typeof supportedChains)[number];

// Map of chain names to chain objects
export const chains: Record<ChainName, Chain> = _chains;
