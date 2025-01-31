# Gasless

**A server library for creating a gasless server with [MUD-compliant](https://github.com/latticexyz/mud) Ethereum smart contracts.**

This library is available as a [npm package](https://www.npmjs.com/package/@primodiumxyz/gasless-server).

It is also available as a [Docker image on ghcr](https://github.com/primodiumxyz/gasless-server/pkgs/container/gasless-server) so you can run it straight away in a container.

- [Introduction](#introduction)
  - [Overview](#overview)
  - [Installation](#installation)
  - [Environment](#environment)
  - [Quickstart](#quickstart)
- [Usage](#usage)
- [Development](#development)
  - [Running the server](#running-the-server)
  - [Testing and building](#testing-and-building)
- [Contributing](#contributing)
- [License](#license)

## Introduction

### Overview

This gasless server allows users to set up delegation within MUD systems for the paymaster/server wallet to make system calls on their behalf, without requiring them to pay gas.

Additionally, the server exposes endpoints to directly send signed transactions to the server, which will be broadcasted on the user's behalf. The main benefit here is that it allows native tokens to be passed from the user's wallet to some recipient or contract, which is not possible within the MUD system.

It provides types for both node and browser environments.

The smart contract toolkit in this repository is based on [Foundry](https://github.com/foundry-rs/foundry) and [Anvil](https://github.com/foundry-rs/foundry/tree/master/crates/anvil) as the local Ethereum development node.

### Installation

Just install the package from npm, preferably with pnpm.

```bash
pnpm add @primodiumxyz/gasless-server
```

### Quickstart

1. Configuration

Add the following environment variables to your `.env` file:

| Variable                        | Description                                           | Default                                                              |
| ------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| `GASLESS_SERVER_PRIVATE_KEY`    | Private key to use for the server wallet              | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| `GASLESS_SERVER_CHAIN`          | Chain to use (dev, calderaSepolia, or any viem chain) | `dev`                                                                |
| `GASLESS_SERVER_PORT`           | Port to run the server on                             | `3000`                                                               |
| `GASLESS_SERVER_SESSION_SECRET` | Fastify session secret                                | `pqu3QS3OUB9tIiWntAEI7PkaIfp2H73Me2Lqq340FXc2`                       |

2. Run

```sh
local-gasless-server
# or specify the path to your .env file (install @dotenvx/dotenvx first)
dotenvx run -f ./path/to/.env --quiet -- local-gasless-server
```

## Usage

### Docker

Usage with Docker is the recommended way to run the server, as you can directly consume [the image published on the GitHub Container Registry](https://github.com/primodiumxyz/gasless-server/pkgs/container/gasless-server).

You can use the [`server.docker-compose.yaml`](./server.docker-compose.yaml) file provided for reference, fill in the environment variables, and run:

```sh
docker compose up
```

This will pull the image from the registry and start the indexer.

To stop the indexer, you can use:

```sh
docker compose down --remove-orphans
```

### TypeScript

TODO_TYPESCRIPT

## Development

### Running the server

```bash
pnpm dev:server # from root
```

The server will start on the port specified in the `.env` file.

### Testing and building

To run tests, first deploy the test contracts from the root directory:

```bash
# Add the Anvil private key to `packages/test-contracts/.env`
echo "PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" > packages/test-contracts/.env

# Run the Anvil development node and deploy contracts
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

## Contributing

If you wish to contribute to the package, please open an issue first to make sure that this is within the scope of the library, and that it is not already being worked on.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.
