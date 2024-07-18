import { decodeValueArgs } from "@latticexyz/protocol-parser/internal";
import { Address, Hex, padHex } from "viem";

import { TEST_MUD_CONFIG, TEST_WORLD_CONTRACT } from "@tests/lib/constants";
import { CallWithSignatureNonces, FunctionSelectors } from "@tests/lib/tableDefs";

export async function fetchSystemFunctionSelector(rawSelector: Hex) {
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

export async function fetchSignatureNonce(userAddress: Address) {
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

export async function fetchUserPosition(userAddress: Address) {
  const res = await TEST_WORLD_CONTRACT.read.getRecord([
    TEST_MUD_CONFIG.tables.Position.tableId,
    [padHex(userAddress, { size: 32, dir: "left" })],
  ]);

  return decodeValueArgs(
    // TODO: find a better way to grab the schema from the mud config
    { x: "int32", y: "int32" },
    {
      staticData: res[0],
      encodedLengths: res[1],
      dynamicData: res[2],
    },
  );
}
