import { Address, getContract } from "viem";

import { WALLET } from "@/utils/constants";

import testConfig from "../../../test-contracts/mud.config.ts";
import testContractsAbi from "../../../test-contracts/out/IWorld.sol/IWorld.abi.json";
import type testContractsAbiType from "../../../test-contracts/out/IWorld.sol/IWorld.abi.json.d.ts";
import worlds from "../../../test-contracts/worlds.json";

export const CHAIN_ID = 31337;
export const TEST_WORLD_ABI = testContractsAbi as typeof testContractsAbiType;
export const TEST_WORLD_ADDRESS = worlds[CHAIN_ID].address as Address;
export const TEST_MUD_CONFIG = testConfig;
export const TEST_WORLD_CONTRACT = getContract({
  address: TEST_WORLD_ADDRESS,
  abi: TEST_WORLD_ABI,
  client: WALLET,
});

export const TEST_SERVER_ENDPOINT = "http://localhost:3000";
