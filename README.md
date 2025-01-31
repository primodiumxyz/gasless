# Gasless

**A server library for creating a gasless server with [MUD-compliant](https://github.com/latticexyz/mud) Ethereum smart contracts.**

This monorepo contains the server library and a test contracts package for verifying the server's functionality.

The server library is available as a [npm package](https://www.npmjs.com/package/@primodiumxyz/gasless-server).

The server is also available as a [Docker image on ghcr](https://github.com/primodiumxyz/gasless-server/pkgs/container/gasless-server) so you can run it straight away in a container.

Read the server [README](/packages/server/README.md) for more information on usage.

- [Introduction](#introduction)
  - [Overview](#overview)
  - [Installation](#installation)
  - [Environment](#environment)
- [Development](#development)
  - [Running the server](#running-the-server)
  - [Testing and building](#testing-and-building)
- [Additional context](#additional-context)
  - [Limitations](#limitations)
  - [Details](#details)
  - [Mitigation](#mitigation)
  - [Potential solutions](#potential-solutions)
- [Contributing](#contributing)
- [License](#license)

## Introduction

### Overview

This gasless server allows users to set up delegation within MUD systems for the paymaster/server wallet to make system calls on their behalf, without requiring them to pay gas.

Additionally, the server exposes endpoints to directly send signed transactions to the server, which will be broadcasted on the user's behalf. The main benefit here is that it allows native tokens to be passed from the user's wallet to some recipient or contract, which is not possible within the MUD system.

It provides types for both node and browser environments.

The smart contract toolkit in this repository is based on [Foundry](https://github.com/foundry-rs/foundry) and [Anvil](https://github.com/foundry-rs/foundry/tree/master/crates/anvil) as the local Ethereum development node.

### Installation

#### Requirements

- pnpm

  ```bash
  npm install -g pnpm
  ```

- [node version <=20](https://github.com/latticexyz/mud/pull/3456)

  ```bash
  nvm install 20
  ```

- [Foundry](https://book.getfoundry.sh/getting-started/installation#installation)

  ```bash
  curl -L https://foundry.paradigm.xyz | bash
  foundryup
  ```

#### Repository

```bash
git clone https://github.com/primodiumxyz/gasless-server.git
cd gasless-server
pnpm i
```

### Environment

Add the following environment variables to your `packages/server/.env` file:

| Variable                        | Description                                           | Default                                                              |
| ------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| `GASLESS_SERVER_PRIVATE_KEY`    | Private key to use for the server wallet              | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| `GASLESS_SERVER_CHAIN`          | Chain to use (dev, calderaSepolia, or any viem chain) | `dev`                                                                |
| `GASLESS_SERVER_PORT`           | Port to run the server on                             | `3000`                                                               |
| `GASLESS_SERVER_SESSION_SECRET` | Fastify session secret                                | `pqu3QS3OUB9tIiWntAEI7PkaIfp2H73Me2Lqq340FXc2`                       |

## Development

### Running the server

```bash
pnpm dev:server
```

The server will start on the port specified in the `.env` file.

### Testing and building

To run tests, first deploy the test contracts:

```bash
# Add the Anvil private key to `packages/test-contracts/.env`
echo "PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" > packages/test-contracts/.env

# Run the Anvil development node, deploy contracts, and start the server
pnpm run dev
```

Then run tests in a separate terminal session:

```bash
pnpm test
# or
pnpm test:watch
# or
pnpm test:ui
```

To build the server package, run:

```bash
pnpm build
```

## Additional context

### Limitations

There are some limitations to this server due to the intrinsic design of MUD. The specific issue is that **a wallet cannot authorize a transaction with a native token transfer to be made on its behalf**.

### Details

The way MUD works is that the EOA of the delegator (the user) authorizes a delegate's EOA (the centralized wallet in the gasless server) to make system calls on its behalf—as in calls within the MUD system—but there is no way for an EOA to authorize another EOA to perform unlimited native token transfers on its behalf. Therefore, appending a native token transfer to a MUD call through delegation is technically possible, but it would transfer the funds out of the delegate's EOA, which is not what we want.

This design would however work for any app that doesn't require native token transfers; i.e., a game that solely performs calls within the MUD system, without any payment of native tokens.

### Mitigation

One mitigation is to have the delegator sign the transaction, and send it to the server in order for the delegate to broadcast it, and effectively pay for the gas. This way, we're not using the MUD delegation system but rather some native EVM gas sponsorship. However, the user/delegator has to sign every single call, so even though this solution does enable gas sponsorship, it doesn't solve the UX problem of removing systematic interaction with the wallet for every single transaction to be made.

The above design is integrated into the gasless server under the `signedCall` route, and doesn't require initializing a MUD delegation (as it doesn't use it at all).

### Potential solutions

There are a few solutions that could be implemented to enable true gasless and signless transactions. For instance:

1. Using an ERC20 token (e.g. WETH) instead of native tokens, and pre-approving the delegate to transfer a large enough amount of that token on behalf of the delegator.
2. Prompting the delegator to deposit native tokens into the delegate's wallet through a contract, and tracking their balance (`deposited amount - amount spent on their behalf`) on every call. This would revert if the user doesn't have enough "allowance" (balance). This would use the standard MUD delegation design, which is that native tokens are transferred from the _delegate wallet_, while we take care of depositing/tracking balances ourselves.
3. Creating a smart account for the user, which would be able to delegate transfers of native tokens to another wallet as part of its design. This would require the user to deposit some funds into the smart account, so it's a bit similar to the previous solution in terms of UX.

## Contributing

If you wish to contribute to the package, please open an issue first to make sure that this is within the scope of the library, and that it is not already being worked on.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.
