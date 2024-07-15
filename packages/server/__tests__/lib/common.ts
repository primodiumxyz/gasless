import { resourceToHex } from "@latticexyz/common";
import { Hex } from "viem";

export const getSystemId = (name: string, namespace = ""): Hex => {
  return resourceToHex({ type: "system", name, namespace });
};
