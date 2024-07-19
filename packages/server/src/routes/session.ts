"use strict";

import { FastifyInstance } from "fastify";
import { Address, decodeFunctionData, getContract, Hex } from "viem";

import { Abi } from "@/utils/abi";
import { WALLET } from "@/utils/constants";
import { SYSTEMBOUND_DELEGATION, TIMEBOUND_DELEGATION } from "@tests/lib/constants";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async function (request) {
    return {
      authenticated: request.session.authenticated ?? false,
    };
  });

  fastify.post("/", async function (request, reply) {
    const {
      address,
      worldAddress,
      params: [systemId, callData, signature],
    } = request.body as {
      address: Address;
      worldAddress: Address;
      params: [systemId: Hex, callData: Hex, signature: Hex];
    };

    try {
      //check delegation type since we only support unlimited and timebound. Also will need to update user session to match delegation expiration
      const {
        args: [, delegationControlId, initCallData],
      } = decodeFunctionData({
        abi: Abi,
        data: callData,
      });

      if (delegationControlId === SYSTEMBOUND_DELEGATION) {
        return reply.badRequest("Systembound delegation is not supported yet.");
      }

      if (delegationControlId === TIMEBOUND_DELEGATION) {
        const {
          args: [, delegationExpiration],
        } = decodeFunctionData({
          abi: Abi,
          data: initCallData as Hex,
        });
        request.session.cookie.expires = new Date(Number(delegationExpiration) * 1000);
      }

      const worldContract = getContract({
        address: worldAddress,
        abi: Abi,
        client: WALLET,
      });

      const hash = await fastify.TransactionManager.queueTx(
        async () => await worldContract.write.callWithSignature([address, systemId, callData, signature]),
      );

      const receipt = await WALLET.waitForTransactionReceipt({
        hash,
      });

      if (receipt.status === "reverted") return reply.badRequest("Delegation transaction reverted.");

      request.session.authenticated = true;
      request.session.address = address;

      return {
        authenticated: true,
        txHash: hash,
      };
    } catch (error) {
      console.error("Error in contract write operation:", error);
      return reply.badRequest("Failed to execute contract write operation");
    }
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
    return { authenticated: false };
  });
}

export const autoPrefix = "/session";
