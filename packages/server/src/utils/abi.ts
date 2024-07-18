import TimeboundDelegationControl from "@latticexyz/world-modules/out/TimeboundDelegationControl.sol/TimeboundDelegationControl.abi.json";
import type TimeboundDelegationControlType from "@latticexyz/world-modules/out/TimeboundDelegationControl.sol/TimeboundDelegationControl.abi.json.d.ts";
import CallWithSignatureAbi from "@latticexyz/world-modules/out/Unstable_CallWithSignatureSystem.sol/Unstable_CallWithSignatureSystem.abi.json";
import type CallWithSignatureAbiType from "@latticexyz/world-modules/out/Unstable_CallWithSignatureSystem.sol/Unstable_CallWithSignatureSystem.abi.json.d.ts";
import World from "@latticexyz/world-modules/out/World.sol/World.abi.json";
import type WorldType from "@latticexyz/world-modules/out/World.sol/World.abi.json.d.ts";

export const RegisterDelegationAbi = [
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
];

export const Abi = [...CallWithSignatureAbi, ...World, ...TimeboundDelegationControl, ...RegisterDelegationAbi] as
  | typeof CallWithSignatureAbiType
  | typeof WorldType
  | typeof TimeboundDelegationControlType;
