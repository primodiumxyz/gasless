"use strict";

import { FastifyInstance } from "fastify";
import { decodeFunctionData, getContract, Hex } from "viem";

import { Abi } from "@/utils/abi";
import { CHAIN, SERVER_WALLET, SYSTEMBOUND_DELEGATION, TIMEBOUND_DELEGATION } from "@/utils/constants";
import { RouteSessionPostParams } from "@/utils/types";

/**
 * Registers the `session` route.
 *
 * @param {FastifyInstance} fastify - The Fastify instance.
 */
export default async function (fastify: FastifyInstance) {
  /* ----------------------------------- GET ---------------------------------- */
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
    } = request.body as RouteSessionPostParams;

    try {
      // Check delegation type since we only support unlimited and timebound
      // We also need to update user session to match delegation expiration
      const {
        args: [, delegationControlId, initCallData],
      } = decodeFunctionData({
        abi: Abi,
        data: callData,
      });

      // TODO: pass delegation ids since it might be different because of namespace
      if (delegationControlId === SYSTEMBOUND_DELEGATION) {
        return reply.badRequest("Systembound delegation is not supported yet.");
      }

      // Update session expiration if timebound delegation
      if (delegationControlId === TIMEBOUND_DELEGATION) {
        const {
          args: [, delegationExpiration],
        } = decodeFunctionData({
          abi: Abi,
          data: initCallData as Hex,
        });

        request.session.cookie.expires = new Date(Number(delegationExpiration) * 1000);
      }

      // Grab world contract
      const worldContract = getContract({
        address: worldAddress,
        abi: Abi,
        client: SERVER_WALLET,
      });

      // Queue transaction
      const hash = await fastify.TransactionManager.queueTx(
        async () =>
          await worldContract.write.callWithSignature([address, systemId, callData, signature], {
            account: SERVER_WALLET.account,
            chain: CHAIN,
            gas: 1_000_000n,
          }),
      );

      // Wait for transaction to be mined
      const receipt = await SERVER_WALLET.waitForTransactionReceipt({
        hash,
      });

      if (receipt.status === "reverted") return reply.badRequest("Delegation transaction reverted.");

      // Update session
      request.session.authenticated = true;
      request.session.address = address;
      request.session.worldAddress = worldAddress;

      fastify.log.info(
        "Registered delegation and session for user:",
        request.session.address,
        " in world:",
        request.session.worldAddress,
      );

      return {
        authenticated: true,
        txHash: hash,
      };
    } catch (error) {
      console.error("Error in contract write operation:", error);
      return reply.badRequest("Failed to execute contract write operation");
    }
  });

  /* --------------------------------- DELETE --------------------------------- */
  fastify.delete("/", async function (request, reply) {
    if (request.session.authenticated) {
      if (!request.session.worldAddress) {
        return reply.badRequest("User's delegation world address was not found.");
      }

      // Grab world contract
      const worldContract = getContract({
        address: request.session.worldAddress,
        abi: Abi,
        client: SERVER_WALLET,
      });

      // Check if user has an address
      if (!request.session.address) {
        return reply.badRequest("User's address was not found.");
      }

      // Queue transaction
      const hash = await fastify.TransactionManager.queueTx(
        async () =>
          await worldContract.write.unregisterDelegation([request.session.address!], {
            account: SERVER_WALLET.account,
            chain: CHAIN,
          }),
      );

      // Wait for transaction to be mined
      const receipt = await SERVER_WALLET.waitForTransactionReceipt({
        hash,
      });

      if (receipt.status === "reverted") return reply.badRequest("Unregister Delegation transaction reverted.");
      fastify.log.info("Unregistered delegation for user:", request.session.address);

      // Destroy session
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
