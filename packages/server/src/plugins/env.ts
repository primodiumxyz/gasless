"use strict";

import fastifyEnv from "@fastify/env";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Hex } from "viem";

import { TEST } from "@/utils/constants";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: number;
      PRIVATE_KEY: Hex;
      NODE_ENV: "development" | "production" | "test";
    };
  }
}

const schema = {
  type: "object",
  required: ["PORT", "PRIVATE_KEY"],
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
    TEST_VAR: {
      type: "string",
    },
  },
};

export default fp(async function (fastify: FastifyInstance) {
  fastify
    .register(fastifyEnv, {
      schema,
      dotenv: !TEST ? true : false,
      data: process.env,
    })
    .ready((err) => {
      if (err) {
        fastify.log.error(err);
      }
      fastify.log.info("Environment variables loaded successfully.");
    });
});
