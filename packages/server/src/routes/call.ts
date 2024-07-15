"use strict";

import { FastifyInstance } from "fastify";
import { Address, getContract, Hex } from "viem";

import { Abi } from "@/utils/abi";

export default async function (fastify: FastifyInstance) {
  fastify.post("/", async function (request, response) {
    if (!request.session.authenticated) return response.unauthorized("Not authenticated");

    if (!request.session.address)
      return response.unauthorized("No address found in session. Re-delegation is required.");

    try {
      const { worldAddress, systemId, callData } = request.body as {
        worldAddress: Address;
        systemId: Hex;
        callData: Hex;
      };

      const worldContract = getContract({
        address: worldAddress,
        abi: Abi,
        client: fastify.config.WALLET,
      });

      const hash = await worldContract.write.callFrom([request.session.address, systemId, callData]);

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
