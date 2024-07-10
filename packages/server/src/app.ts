"use strict";

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import autoLoad from "@fastify/autoload";
import fastify from "fastify";

import { DEV } from "@/utils/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Asynchronously builds the application by registering plugins and routes.
 *
 * This function first registers all plugins located in the "plugins" directory,
 * then proceeds to register all routes located in the "routes" directory.
 * Both registrations are done using the `autoLoad` function provided by the application framework.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when all registrations are complete.
 */
export async function build() {
  const app = fastify({
    logger: {
      level: DEV ? "debug" : "warn",
      stream: process.stdout,
    },
  });

  // register plugins
  await app.register(autoLoad, {
    dir: join(__dirname, "plugins"),
  });

  // register routes
  await app.register(autoLoad, {
    dir: join(__dirname, "routes"),
  });

  return app;
}

/**
 * Starts the application by building it and listening on port(default 3000).
 *
 * This function first builds the application by calling the `build` function,
 * then listens on port 3000 for incoming requests.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when the application is ready to accept requests.
 */
export async function start() {
  const fastify = await build();

  fastify.listen({ port: fastify.config.PORT }, (err, address) => {
    if (err) {
      console.error(err);
    }

    fastify.log.info(`Server listening at ${address}`);
  });

  /**
   * Gracefully disposes of the application by closing the server.
   *
   * This function closes the server and disposes of any resources used by the application.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when the server is closed.
   */
  async function dispose() {
    fastify.log.info("Disposing of the server.");
    await fastify.close();
  }

  return { fastify, dispose };
}
