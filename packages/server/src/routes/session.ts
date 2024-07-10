"use strict";

import { FastifyInstance } from "fastify";

export default async function routes(fastify: FastifyInstance) {
  fastify.get("/", async function (request) {
    return { authenticated: request.session.authenticated ?? false };
  });

  fastify.post("/", async function (request) {
    request.session.authenticated = true;
    return { authenticated: true };
  });

  fastify.delete("/", async function (request, reply) {
    if (request.session.authenticated) {
      request.session.destroy((err) => {
        if (err) {
          void reply.internalServerError("Failed to destroy session.");
        }
      });
    }
    return { authenticated: false };
  });
}

export const autoPrefix = "/session";
