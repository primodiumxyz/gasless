"use strict";

import fastifyEnv from "@fastify/env";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Chain, createWalletClient, Hex, http, HttpTransport, PrivateKeyAccount, WalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { foundry } from "viem/chains";

import { calderaSepolia } from "@/utils/chain";
import { PROD, TEST } from "@/utils/constants";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: number;
      PRIVATE_KEY: Hex | null;
      NODE_ENV: "development" | "production" | "test";
      SESSION_SECRET: string;
      WALLET: WalletClient<HttpTransport, Chain, PrivateKeyAccount>;
    };
  }
}

const schema = {
  type: "object",
  required: ["PORT", "PRIVATE_KEY", "SESSION_SECRET"],
  properties: {
    PORT: {
      type: "number",
      default: 3000,
    },
    NODE_ENV: {
      type: "string",
      default: "development",
    },
    PRIVATE_KEY: {
      type: "string",
    },
    SESSION_SECRET: {
      type: "string",
    },
  },
};

export default fp(async function (fastify: FastifyInstance) {
  fastify
    .register(fastifyEnv, {
      schema,
      dotenv: TEST ? false : true,
      data: process.env,
    })
    .ready((err) => {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }

      const account = privateKeyToAccount(fastify.config.PRIVATE_KEY!);
      fastify.config.PRIVATE_KEY = null;

      fastify.config.WALLET = createWalletClient({
        account,
        transport: http(),
        chain: PROD ? calderaSepolia : foundry,
      });

      fastify.log.info("Environment variables loaded successfully.");
    });
});
