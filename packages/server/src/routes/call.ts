"use strict";

import { FastifyInstance } from "fastify";
import { Address, getContract, Hex } from "viem";

import { Abi } from "@/utils/abi";
import { WALLET } from "@/utils/constants";

export default async function (fastify: FastifyInstance) {
  fastify.post("/", async function (request, response) {
    if (!request.session.authenticated) return response.unauthorized("Not authenticated");

    if (!request.session.address)
      return response.unauthorized("No address found in session. Re-delegation is required.");

    try {
      const { worldAddress, params } = request.body as {
        worldAddress: Address;
        params: [Hex, Hex, Hex];
      };

      const worldContract = getContract({
        address: worldAddress,
        abi: Abi,
        client: WALLET,
      });

      const hash = await fastify.TransactionManager.queueTx(async () => await worldContract.write.callFrom(params));

      await WALLET.waitForTransactionReceipt({
        hash,
      });

      return {
        txHash: hash,
      };
    } catch (error) {
      console.error("Error in contract write operation:", error);
      return response.badRequest("Failed to execute contract write operation");
    }
  });
}

export const autoPrefix = "/call";
