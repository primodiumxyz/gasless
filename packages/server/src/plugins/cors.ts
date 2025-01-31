import fastifyCors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import { DEV, TEST } from "@/utils/constants";

// Register the CORS plugin
export default fp(async function (fastify: FastifyInstance) {
  const allowedOrigins = DEV || TEST ? true : process.env.ALLOWED_ORIGINS?.split(",");
  fastify
    .register(fastifyCors, {
      origin: allowedOrigins,
      credentials: true,
    })
    .ready((err) => {
      if (err) {
        fastify.log.error(err);
      }
      fastify.log.info("CORS plugin loaded successfully.");
    });
});
