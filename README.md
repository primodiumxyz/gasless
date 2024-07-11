# Primodium Gasless

Server and client libraries for creating a MUD-compliant gasless server.

# Getting Started

## Running a local gasless server:

### Requirements

- pnpm

To start a local dev server:

```bash
pnpm i
pnpm dev
```

To run tests:

```bash
pnpm test
or
pnpm test:watch
or
pnpm test:ui
```

# Packages

## `@primodiumxyz/gasless-server`

Lightweight server for handling user delegations to the server and submitting transactions on their behalf eliminating the need for users to pay gas!

[README](/packages/server/README.md) for more info.

## `@primodiumxyz/gasless-client`

Small client wrapper that handles delegation calls and submitting transactions requests to the server.

[README](/packages/client/README.md) for more info.
