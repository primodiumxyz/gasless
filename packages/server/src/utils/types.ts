import { Address, Hex, SerializeSignatureReturnType } from "viem";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
    }
  }
}

/* ------------------------------- DELEGATION ------------------------------- */
/**
 * Type alias for the delegation ABI.
 *
 * This is a type alias for the delegation ABI, which is used to register and unregister delegations.
 */
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

/* --------------------------------- ROUTES --------------------------------- */
/**
 * Type alias for the routes supported by the server.
 *
 * This includes the `root`, `call`, `session`, and `signedCall` routes.
 */
export type Route = "/" | "/call" | "/session" | "/signedCall";

/**
 * Type alias for the routes that support the `DELETE` method.
 *
 * This includes the `session` route.
 */
export type DeleteRoute = Extract<Route, "/session">;

/**
 * Type alias for the routes that support the `GET` method.
 *
 * This includes the `root` and `session` routes.
 */
export type GetRoute = Extract<Route, "/" | "/session">;

/**
 * Type alias for the routes that support the `POST` method.
 *
 * This includes the `call`, `session`, and `signedCall` routes.
 */
export type PostRoute = Extract<Route, "/call" | "/session" | "/signedCall">;

/**
 * Type alias for the methods supported by the server.
 *
 * This includes the `GET`, `POST`, and `DELETE` methods.
 */
export type Method = "GET" | "POST" | "DELETE";

/* --------------------------------- PARAMS --------------------------------- */
/**
 * Type alias for the parameters of a route.
 *
 * @template T - The {@link Route}.
 * @template M - The {@link Method}.
 * @returns The parameters type of the route.
 */
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

/* --------------------------------- RESPONSES --------------------------------- */
/**
 * Type alias for the response of a route.
 *
 * @template T - The {@link Route}.
 * @template M - The {@link Method}.
 * @returns The response type of the route.
 */
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

/**
 * Type alias for a bad response.
 *
 * @property {number} statusCode - The HTTP status code: `400`.
 * @property {string} error - The error message: `"Bad Request"`.
 * @property {string} message - The error message.
 */
export type BadResponse = {
  statusCode: 400;
  error: "Bad Request";
  message: string;
};

/* --------------------------------- ROOT --------------------------------- */
/**
 * Type alias for the response of the successful `root` route.
 *
 * @property {string} status - The status: `"OK"`.
 */
export type RouteRootGetResponse = {
  status: "OK";
};

/**
 * Type alias for the response of the `session` route.
 *
 * @property {boolean} authenticated - Whether the session is authenticated.
 */
export type RouteSessionGetResponse = {
  authenticated: boolean;
};

/**
 * Type alias for the response of the `session` route.
 *
 * @property {boolean} authenticated - Whether the session is authenticated: `false`.
 */
export type RouteSessionDeleteResponse = {
  authenticated: false;
};

/**
 * Type alias for the parameters of the `session` route.
 *
 * @property {Address} address - The address of the session.
 * @property {Address} worldAddress - The address of the world.
 * @property {Hex[]} params - The parameters of the session.
 */
export type RouteSessionPostParams = {
  address: Address;
  worldAddress: Address;
  params: [systemId: Hex, callData: Hex, signature: Hex];
};

/**
 * Type alias for the response of the `session` route.
 *
 * @property {boolean} authenticated - Whether the session is authenticated: `true`.
 * @property {Hex} txHash - The transaction hash.
 */
export type RouteSessionPostResponse = {
  authenticated: true;
  txHash: Hex;
};

/* --------------------------------- CALL --------------------------------- */
/**
 * Type alias for the parameters of the `call` route.
 *
 * @property {Address} worldAddress - The address of the world.
 * @property {Hex[]} params - The parameters of the call.
 * @property {object} options - The options for the call.
 */
export type RouteCallPostParams = {
  worldAddress: Address;
  params: [from: Address, delegationControlId: Hex, callData: Hex];
  options?: { gas?: string };
};

/**
 * Type alias for the response of the `call` route.
 *
 * @property {Hex} txHash - The transaction hash.
 */
export type RouteCallPostResponse = {
  txHash: Hex;
};

/* --------------------------------- SIGNED CALL --------------------------------- */
/**
 * Type alias for the parameters of the `signedCall` route.
 *
 * @property {SerializeSignatureReturnType} signature - The signature.
 */
export type RouteSignedCallPostParams = {
  signature: SerializeSignatureReturnType;
};

/**
 * Type alias for the response of the `signedCall` route.
 *
 * @property {Hex} txHash - The transaction hash.
 */
export type RouteSignedCallPostResponse = {
  txHash: Hex;
};
