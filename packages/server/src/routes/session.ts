"use strict";

import { FastifyInstance } from "fastify";
import { Address, getContract, Hex } from "viem";

import { Abi } from "@/utils/abi";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async function (request) {
    return {
      authenticated: request.session.authenticated ?? false,
    };
  });

  fastify.post("/", async function (request) {
    const { address, worldAddress, systemId, callData, signature } = request.body as {
      address: Address;
      worldAddress: Address;
      systemId: Hex;
      callData: Hex;
      signature: Hex;
    };

    const worldContract = getContract({
      address: worldAddress,
      abi: Abi,
      client: fastify.config.WALLET,
    });

    const hash = await worldContract.write.callWithSignature([address, systemId, callData, signature]);

    request.session.authenticated = true;
    request.session.address = address;

    return {
      authenticated: true,
      txHash: hash,
    };
  });

  fastify.delete("/", async function (request, reply) {
    if (request.session.authenticated) {
      request.session.destroy((err) => {
        if (err) {
          void reply.internalServerError("Failed to destroy session.");
          fastify.log.error(err);
        }
      });
    }
    return { authenticated: false, txQueue: [], txQueueLength: 0 };
  });
}

export const autoPrefix = "/session";
