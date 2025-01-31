"use strict";

import { FastifyInstance } from "fastify";

/**
 * Registers the `root` route.
 *
 * @param {FastifyInstance} fastify - The Fastify instance.
 */
export default async function (fastify: FastifyInstance) {
  fastify.get("/", async function () {
    return { status: "OK" };
  });
}
