import CallWithSignatureAbi from "@latticexyz/world-module-callwithsignature/out/CallWithSignatureSystem.sol/CallWithSignatureSystem.abi.json" with { type: "json" };
import type CallWithSignatureAbiType from "@latticexyz/world-module-callwithsignature/out/CallWithSignatureSystem.sol/CallWithSignatureSystem.abi.json.d.ts";
import TimeboundDelegationControl from "@latticexyz/world-modules/out/TimeboundDelegationControl.sol/TimeboundDelegationControl.abi.json" with { type: "json" };
import type TimeboundDelegationControlType from "@latticexyz/world-modules/out/TimeboundDelegationControl.sol/TimeboundDelegationControl.abi.json.d.ts";
import World from "@latticexyz/world-modules/out/World.sol/World.abi.json" with { type: "json" };
import type WorldType from "@latticexyz/world-modules/out/World.sol/World.abi.json.d.ts";

import { DelegationAbiType } from "@/utils/types";

const DelegationAbi: DelegationAbiType = [
  {
    type: "function",
    name: "registerDelegation",
    inputs: [
      {
        name: "delegatee",
        type: "address",
        internalType: "address",
      },
      {
        name: "delegationControlId",
        type: "bytes32",
        internalType: "ResourceId",
      },
      {
        name: "initCallData",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unregisterDelegation",
    inputs: [
      {
        name: "delegatee",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const Abi = [...CallWithSignatureAbi, ...World, ...TimeboundDelegationControl, ...DelegationAbi] as
  | typeof CallWithSignatureAbiType
  | typeof WorldType
  | typeof TimeboundDelegationControlType
  | DelegationAbiType;
