"use strict";

import { fastifyRateLimit } from "@fastify/rate-limit";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import { PROD, REDIS } from "@/utils/constants";

export default fp(async function (fastify: FastifyInstance) {
  if (!PROD) return;

  fastify
    .register(fastifyRateLimit, {
      max: 32,
      timeWindow: "1 minute",
      redis: REDIS,
    })
    .ready((err) => {
      if (err) {
        fastify.log.error(err);
      }
      fastify.log.info("Sensible plugin loaded successfully.");
    });
});
