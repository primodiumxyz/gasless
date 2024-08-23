"use strict";

import { FastifyInstance } from "fastify";
import { getContract } from "viem";

import { Abi } from "@/utils/abi";
import { chains } from "@/utils/chain";
import { CHAIN, SERVER_WALLET } from "@/utils/constants";
import { RouteCallPostParams } from "@/utils/types";

export default async function (fastify: FastifyInstance) {
  fastify.post("/", async function (request, response) {
    if (!request.session.authenticated) return response.unauthorized("Not authenticated");

    if (!request.session.address)
      return response.unauthorized("No address found in session. Re-delegation is required.");

    try {
      const {
        worldAddress,
        params: [from, delegationControlId, callData],
        options,
      } = request.body as RouteCallPostParams;

      const worldContract = getContract({
        address: worldAddress,
        abi: Abi,
        client: SERVER_WALLET,
      });

      const hash = await fastify.TransactionManager.queueTx(
        async () =>
          await worldContract.write.callFrom([from, delegationControlId, callData], {
            account: SERVER_WALLET.account,
            chain: chains[CHAIN],
            gas: options?.gas ? BigInt(options.gas) : undefined,
            value: options?.value ? BigInt(options.value) : BigInt(0),
          }),
      );

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
