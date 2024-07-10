import fastifyCookie from "@fastify/cookie";
import { fastifySession } from "@fastify/session";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import { PROD } from "@/utils/constants";

// Extend fastify.session with your custom type.
declare module "fastify" {
  interface Session {
    user_id: string;
    authenticated: boolean;
    other_key: string;
    id?: number;
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
      secret: fastify.config.SESSION_SECRET,
      cookieName: "session",
      cookiePrefix: "pri-",
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
