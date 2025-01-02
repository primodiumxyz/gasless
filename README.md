# Primodium Gasless

Server and client libraries for creating a gasless server with [MUD-compliant](https://github.com/latticexyz/mud) Ethereum smart contracts.

# Getting Started

The smart contract toolkits in this repository is based on the [Foundry toolkit](https://github.com/foundry-rs/foundry), with [Anvil](https://github.com/foundry-rs/foundry/tree/master/crates/anvil) as the local Ethereum development node.

## Running a local gasless server:

### Requirements

- pnpm

To start a local dev server:

```bash
pnpm i
pnpm dev:server
```

### Tests

To run tests, first deploy the test contracts:

```bash
# Add the Anvil private key to `packages/test-contracts/.env`
echo "PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" > packages/test-contracts/.env

# Run the Anvil development node and deploy contracts
pnpm run dev
```

Then run tests in a separate terminal session:

```
pnpm test
#or
pnpm test:watch
#or
pnpm test:ui
```

# Packages

## `@primodiumxyz/gasless-server`

Lightweight server for handling user delegations to the server and submitting transactions on their behalf eliminating the need for users to pay gas!

[README](/packages/server/README.md) for more info.

## `@primodiumxyz/test-contracts`

Mock MUD contracts for testing the gasless server with vitest.

# Context

## Issue

This gasless server does not work for Primodium Empires because of the intrinsic design of MUD. The specific issue is that **a wallet cannot authorize a transaction with a native token transfer to be made on its behalf**.

## Overview

The way MUD works is that the EOA of the delegator (the user) authorizes a delegate's EOA (the centralized wallet in the gasless server) to make system calls on its behalf—as in calls within the MUD system—but there is no way for an EOA to authorize another EOA to perform unlimited native token transfers on its behalf. Therefore, appending a native token transfer to a MUD call through delegation is technically possible, but it would transfer the funds out of the delegate's EOA, which is not what we want.

This design would however work for any app that doesn't require native token transfers; for instance, Primodium, in which we solely perform calls within the MUD system.

## Mitigation

One mitigation is to have the delegator sign the transaction, and send it to the server in order for the delegate to broadcast it, and effectively pay for the gas. This way, we're not using the MUD delegation system but rather some native EVM gas sponsorship. However, the user/delegator has to sign every single call, so even though this solution does enable gas sponsorship, it doesn't solve the UX problem of removing systematic interaction with the wallet for every single transaction to be made.

The above design is integrated into the gasless server under the `signedCall` route, and doesn't require initializing a MUD delegation (as it doesn't use it at all).

## Potential solutions

There are a few solutions that could be implemented to enable true gasless and signless transactions, but they all require a substantial effort to integrate the missing pieces of infrastructure into Primodium Empires. For instance:

1. Using an ERC20 token (e.g. WETH) instead of native tokens, and pre-approving the delegate to transfer a large enough amount of that token on behalf of the delegator.
2. Prompting the delegator to deposit native tokens into the delegate's wallet through a contract, and tracking their balance (`deposited amount - amount spent on their behalf`) on every call. This would revert if the user doesn't have enough "allowance" (balance). This would use the standard MUD delegation design, which is that native tokens are transferred from the _delegate wallet_, while we take care of depositing/tracking balances ourselves.
3. Creating a smart account for the user, which would be able to delegate transfers of native tokens to another wallet as part of its design. This would require the user to deposit some funds into the smart account, so it's a bit similar to the previous solution in terms of UX.
