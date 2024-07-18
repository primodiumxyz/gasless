import { resourceToHex } from "@latticexyz/common";
import { Hex } from "viem";

export const getSystemId = (name: string, namespace = ""): Hex => {
  return resourceToHex({ type: "system", name, namespace });
};

export const randomCoord = () => {
  return { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) };
};
