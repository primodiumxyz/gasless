import { Address, getContract } from "viem";

import { SERVER_WALLET } from "@/utils/constants";

import testConfig from "../../../test-contracts/mud.config";
import testContractsAbi from "../../../test-contracts/out/IWorld.sol/IWorld.abi.json";
import type testContractsAbiType from "../../../test-contracts/out/IWorld.sol/IWorld.abi.json.d.ts";
import worlds from "../../../test-contracts/worlds.json";

// The chain ID for the test environment
export const CHAIN_ID = 31337;
// The ABI for the test world
export const TEST_WORLD_ABI = testContractsAbi as typeof testContractsAbiType;
// The address of the test world
export const TEST_WORLD_ADDRESS = worlds[CHAIN_ID].address as Address;
// The MUD configuration for the test world
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const TEST_MUD_CONFIG = testConfig;

// The contract instance to interact with the test world
export const TEST_WORLD_CONTRACT = getContract({
  address: TEST_WORLD_ADDRESS,
  abi: TEST_WORLD_ABI,
  client: SERVER_WALLET,
});

// The endpoint for the test server
export const TEST_SERVER_ENDPOINT = "http://localhost:3000";
