"use strict";

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import autoLoad from "@fastify/autoload";
import fastify, { FastifyInstance } from "fastify";

import { DEV, PORT } from "@/utils/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type BuildReturnType = FastifyInstance;
type StartReturnType = {
  fastify: FastifyInstance;
  dispose: () => Promise<void>;
};

/**
 * Asynchronously builds the application by registering plugins and routes.
 *
 * This function first registers all plugins located in the "plugins" directory, then proceeds to register all routes
 * located in the "routes" directory. Both registrations are done using the `autoLoad` function provided by the
 * application framework.
 *
 * @async
 * @returns {Promise<BuildReturnType>} A promise that resolves when all registrations are complete.
 */
export async function build(): Promise<BuildReturnType> {
  const app = fastify({
    logger: {
      level: DEV ? "debug" : "warn",
      stream: process.stdout,
    },
  });

  // register plugins
  await app.register(autoLoad, {
    dir: join(__dirname, "plugins"),
    forceESM: true,
  });

  // register routes
  await app.register(autoLoad, {
    dir: join(__dirname, "routes"),
    forceESM: true,
  });

  return app;
}

/**
 * Starts the application by building it and listening on port(default 3000).
 *
 * This function first builds the application by calling the `build` function, then listens on port 3000 for incoming
 * requests.
 *
 * @async
 * @returns {Promise<StartReturnType>} The fastify instance and a dispose function.
 */
export async function start(): Promise<StartReturnType> {
  const fastify = await build();

  fastify.listen({ port: PORT }, (err, address) => {
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
  async function dispose(): Promise<void> {
    fastify.log.info("Disposing of the server.");
    await fastify.close();
  }

  return { fastify, dispose };
}
