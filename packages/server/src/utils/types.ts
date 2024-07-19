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
