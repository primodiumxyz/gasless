import { Address, Hex, SerializeSignatureReturnType } from "viem";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
    }
  }
}

export type DelegationAbiType = [
  {
    type: "function";
    name: "registerDelegation";
    inputs: [
      {
        name: "delegatee";
        type: "address";
        internalType: "address";
      },
      {
        name: "delegationControlId";
        type: "bytes32";
        internalType: "ResourceId";
      },
      {
        name: "initCallData";
        type: "bytes";
        internalType: "bytes";
      },
    ];
    outputs: [];
    stateMutability: "nonpayable";
  },
  {
    type: "function";
    name: "unregisterDelegation";
    inputs: [
      {
        name: "delegatee";
        type: "address";
        internalType: "address";
      },
    ];
    outputs: [];
    stateMutability: "nonpayable";
  },
];

/* --------------------------------- Routes --------------------------------- */

export type Route = "/" | "/call" | "/session" | "/signedCall";
export type DeleteRoute = Extract<Route, "/session">;
export type GetRoute = Extract<Route, "/" | "/session">;
export type PostRoute = Extract<Route, "/call" | "/session" | "/signedCall">;
export type Method = "GET" | "POST" | "DELETE";

export type RouteParams<T extends Route, M extends Method> = M extends "GET"
  ? never
  : M extends "DELETE"
    ? never
    : T extends "/"
      ? never
      : T extends "/call"
        ? RouteCallPostParams
        : T extends "/session"
          ? RouteSessionPostParams
          : T extends "/signedCall"
            ? RouteSignedCallPostParams
            : never;

export type RouteResponse<T extends Route, M extends Method> = M extends "GET"
  ? T extends "/"
    ? RouteRootGetResponse
    : T extends "/call"
      ? never
      : T extends "/session"
        ? RouteSessionGetResponse
        : T extends "/signedCall"
          ? never
          : never
  : M extends "POST"
    ? T extends "/"
      ? never
      : T extends "/call"
        ? RouteCallPostResponse
        : T extends "/session"
          ? RouteSessionPostResponse
          : T extends "/signedCall"
            ? RouteSignedCallPostResponse
            : never
    : T extends "/session"
      ? RouteSessionDeleteResponse
      : never;

export type BadResponse = {
  statusCode: 400;
  error: "Bad Request";
  message: string;
};

// Root
export type RouteRootGetResponse = {
  status: "OK";
};

// Session
export type RouteSessionGetResponse = {
  authenticated: boolean;
};
export type RouteSessionDeleteResponse = {
  authenticated: false;
};

export type RouteSessionPostParams = {
  address: Address;
  worldAddress: Address;
  params: [systemId: Hex, callData: Hex, signature: Hex];
};
export type RouteSessionPostResponse = {
  authenticated: true;
  txHash: Hex;
};

// Call
export type RouteCallPostParams = {
  worldAddress: Address;
  params: [from: Address, delegationControlId: Hex, callData: Hex];
  options?: { gas?: string };
};
export type RouteCallPostResponse = {
  txHash: Hex;
};

// Signed Call
export type RouteSignedCallPostParams = {
  signature: SerializeSignatureReturnType;
};
export type RouteSignedCallPostResponse = {
  txHash: Hex;
};
