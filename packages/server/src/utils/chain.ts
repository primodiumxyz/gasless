import { Chain } from "viem";
import * as _chains from "viem/chains";

export const supportedChains = Object.keys(_chains) as (keyof typeof _chains)[];
export type ChainName = (typeof supportedChains)[number];
export const chains: Record<ChainName, Chain> = _chains;
