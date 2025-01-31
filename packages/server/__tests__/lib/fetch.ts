import { decodeValueArgs } from "@latticexyz/protocol-parser/internal";
import { Address, Hex, padHex } from "viem";

import { TEST_MUD_CONFIG, TEST_WORLD_CONTRACT } from "@tests/lib/constants";
import { CallWithSignatureNonces, FunctionSelectors } from "@tests/lib/tableDefs";

/**
 * Fetch the system function selector for a given raw selector.
 *
 * @param rawSelector - The raw selector
 * @returns {Promise<Hex>} - The system function selector
 */
export async function fetchSystemFunctionSelector(rawSelector: Hex): Promise<Hex> {
  const res = await TEST_WORLD_CONTRACT.read.getRecord([
    FunctionSelectors.tableId,
    [padHex(rawSelector, { size: 32, dir: "right" })],
  ]);

  const signature = decodeValueArgs(FunctionSelectors.schema, {
    staticData: res[0],
    encodedLengths: res[1],
    dynamicData: res[2],
  }).systemFunctionSelector;

  if (!signature) {
    throw new Error("No system function selector found for selector: " + rawSelector);
  }

  return signature;
}

/**
 * Fetch the nonce for a given user address.
 *
 * @param userAddress - The address of the user
 * @returns {Promise<bigint>} - The signature nonce
 */
export async function fetchSignatureNonce(userAddress: Address): Promise<bigint> {
  const res = await TEST_WORLD_CONTRACT.read.getRecord([
    CallWithSignatureNonces.tableId,
    [padHex(userAddress, { size: 32, dir: "left" })],
  ]);

  return decodeValueArgs(CallWithSignatureNonces.schema, {
    staticData: res[0],
    encodedLengths: res[1],
    dynamicData: res[2],
  }).nonce;
}

type Position = {
  x: number;
  y: number;
};

/**
 * Fetch the position of a user.
 *
 * @param userAddress - The address of the user
 * @returns {Promise<Position>} - The position of the user
 */
export async function fetchUserPosition(userAddress: Address): Promise<Position> {
  const res = await TEST_WORLD_CONTRACT.read.getRecord([
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    TEST_MUD_CONFIG.tables.Position.tableId,
    [padHex(userAddress, { size: 32, dir: "left" })],
  ]);

  return decodeValueArgs(
    { x: "int32", y: "int32" },
    {
      staticData: res[0],
      encodedLengths: res[1],
      dynamicData: res[2],
    },
  );
}
