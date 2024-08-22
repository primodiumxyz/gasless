import { Address, Hex } from "viem";

export type Route = "/" | "/call" | "/session";
export type GetRoute = Extract<Route, "/" | "/session">;
export type PostRoute = Extract<Route, "/call" | "/session">;

export type RouteParams<T extends Route> = T extends "/"
  ? RouteRootGetParams
  : T extends "/call"
    ? RouteCallPostParams
    : T extends "/session"
      ? RouteSessionPostParams
      : never;

export type RouteResponse<T extends Route> = T extends "/"
  ? RouteRootGetResponse
  : T extends "/call"
    ? RouteCallPostResponse
    : T extends "/session"
      ? RouteSessionPostResponse
      : never;

// Root
export type RouteRootGetParams = Record<never, never>;
export type RouteRootGetResponse = {
  status: "OK";
};

// Session
export type RouteSessionGetParams = Record<never, never>;
export type RouteSessionGetResponse = {
  authenticated: boolean;
};

export type RouteSessionPostParams = {
  address: Address;
  worldAddress: Address;
  params: [systemId: Hex, callData: Hex, signature: Hex];
};
export type RouteSessionPostResponse =
  | {
      authenticated: false;
    }
  | {
      authenticated: true;
      txHash: Hex;
    };

// Call
export type RouteCallPostParams = {
  worldAddress: Address;
  params: [from: Address, delegationControlId: Hex, callData: Hex];
};
export type RouteCallPostResponse = {
  txHash: Hex;
};
