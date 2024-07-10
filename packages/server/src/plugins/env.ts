"use strict";

import fastifyEnv from "@fastify/env";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Hex } from "viem";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      // this should be same as the confKey in options
      // specify your typing here
      PORT: number;
      PRIVATE_KEY: Hex;
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
    PRIVATE_KEY: {
      type: "string",
    },
  },
};

export default fp(async function (fastify: FastifyInstance) {
  fastify
    .register(fastifyEnv, {
      schema,
      dotenv: true,
    })
    .ready((err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      fastify.log.info("env vars loaded");
    });
});
