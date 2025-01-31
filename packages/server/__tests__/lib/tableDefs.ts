import { resourceToHex } from "@latticexyz/common";

const UserDelegationControlTableId = resourceToHex({ type: "table", namespace: "", name: "UserDelegationControl" });
const CallWithSignatureNoncesTableId = resourceToHex({ type: "table", namespace: "", name: "CallWithSignatur" });
const FunctionSelectorsTableId = resourceToHex({ type: "table", namespace: "world", name: "FunctionSelectors" });

// UserDelegationControl schema
export const UserDelegationControl = {
  namespace: "world",
  name: "UserDelegationControl",
  tableId: UserDelegationControlTableId,
  schema: {
    delegator: "address",
    delegatee: "address",
    delegationControlId: "bytes32",
  },
  key: ["delegator", "delegatee"],
} as const;

// CallWithSignatureNonces schema
export const CallWithSignatureNonces = {
  namespace: "world",
  name: "CallWithSignatureNonces",
  tableId: CallWithSignatureNoncesTableId,
  key: ["signer"],
  schema: {
    // signer: "address",
    nonce: "uint256",
  },
} as const;

// FunctionSelectors schema
export const FunctionSelectors = {
  name: "FunctionSelectors",
  namespace: "world",
  type: "table",
  key: ["worldFunctionSelector"],
  tableId: FunctionSelectorsTableId,
  schema: {
    // worldFunctionSelector: "bytes4",
    systemId: "bytes32",
    systemFunctionSelector: "bytes4",
  },
} as const;
