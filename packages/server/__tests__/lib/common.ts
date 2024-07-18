import { resourceToHex } from "@latticexyz/common";
import { Hex } from "viem";

export function getSystemId(name: string, namespace = ""): Hex {
  return resourceToHex({ type: "system", name, namespace });
}

export function randomCoord() {
  return { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) };
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
