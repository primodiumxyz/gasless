import fastifyCookie from "@fastify/cookie";
import { fastifySession } from "@fastify/session";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Address } from "viem";

import { PROD, SESSION_SECRET } from "@/utils/constants";

// Extend fastify.session with your custom type.
declare module "fastify" {
  interface Session {
    authenticated?: boolean;
    address?: Address;
    id?: number;
    worldAddress?: Address;
  }
}

export default fp(async function (fastify: FastifyInstance) {
  fastify.register(fastifyCookie).ready((err) => {
    if (err) {
      fastify.log.error(err);
    }
    fastify.log.info("Cookie plugin loaded successfully.");
  });

  fastify
    .register(fastifySession, {
      secret: SESSION_SECRET,
      cookieName: "session",
      cookiePrefix: "pri-",
      saveUninitialized: false,
      cookie: {
        secure: PROD ? true : false,
        httpOnly: true,
        sameSite: "lax",
      },
    })
    .ready((err) => {
      if (err) {
        fastify.log.error(err);
      }
      fastify.log.info("Session plugin loaded successfully.");
    });
});
