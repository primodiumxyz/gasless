"use strict";

import { FastifyInstance } from "fastify";

import { SERVER_WALLET } from "@/utils/constants";
import { RouteSignedCallPostParams } from "@/utils/types";

/**
 * Registers the `signedCall` route.
 *
 * @param {FastifyInstance} fastify - The Fastify instance.
 */
export default async function (fastify: FastifyInstance) {
  fastify.post("/", async function (request, reply) {
    // Retrieve signature from request body
    const { signature } = request.body as RouteSignedCallPostParams;

    try {
      // Queue transaction
      const hash = await fastify.TransactionManager.queueTx(
        async () => await SERVER_WALLET.sendRawTransaction({ serializedTransaction: signature }),
      );

      // Wait for transaction to be mined
      const receipt = await SERVER_WALLET.waitForTransactionReceipt({
        hash,
      });

      if (receipt.status === "reverted") return reply.badRequest("Transaction reverted.");

      // Return transaction hash
      return {
        txHash: hash,
      };
    } catch (error) {
      console.error("Error broadcasting signed call:", error);
      return reply.badRequest("Failed to broadcast signed call");
    }
  });
}

export const autoPrefix = "/signedCall";
