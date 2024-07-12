"use strict";

import { FastifyInstance } from "fastify";
import { Address, getContract, Hex } from "viem";

import { Abi } from "@/utils/abi";

export default async function (fastify: FastifyInstance) {
  fastify.post("/", async function (request, response) {
    if (!request.session.authenticated) return void response.unauthorized("Not authenticated");

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

    const hash = await worldContract.write.callFrom([request.session.address!, systemId, callData]);

    return {
      txHash: hash,
    };
  });
}

export const autoPrefix = "/call";
