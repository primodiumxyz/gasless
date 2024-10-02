# Primodium Gasless

Server and client libraries for creating a gasless server with [MUD-compliant](https://github.com/latticexyz/mud) Ethereum smart contracts.

# Getting Started

The smart contract toolkits in this repository is based on the [Foundry toolkit](https://github.com/foundry-rs/foundry). [Anvil](https://github.com/foundry-rs/foundry/tree/master/crates/anvil) is the local Ethereum development node.

## Running a local gasless server:

### Requirements

- pnpm

To start a local dev server:

```bash
pnpm i
pnpm dev
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
