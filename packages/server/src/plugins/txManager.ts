"use strict";

import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import { createTxManager } from "@/utils/txManager";

declare module "fastify" {
  interface FastifyInstance {
    TransactionManager: ReturnType<typeof createTxManager>;
  }
}

export default fp(async function (fastify: FastifyInstance) {
  fastify.TransactionManager = createTxManager();
  fastify.log.info("Transaction manager initialized successfully.");
});
