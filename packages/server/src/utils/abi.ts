import CallWithSignatureAbi from "@latticexyz/world-modules/out/Unstable_CallWithSignatureSystem.sol/Unstable_CallWithSignatureSystem.abi.json";
import type CallWithSignatureAbiType from "@latticexyz/world-modules/out/Unstable_CallWithSignatureSystem.sol/Unstable_CallWithSignatureSystem.abi.json.d.ts";
import World from "@latticexyz/world-modules/out/World.sol/World.abi.json";
import type WorldType from "@latticexyz/world-modules/out/World.sol/World.abi.json.d.ts";

export const Abi = [...CallWithSignatureAbi, ...World] as typeof CallWithSignatureAbiType | typeof WorldType;
