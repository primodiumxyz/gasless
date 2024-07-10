"use strict";

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import autoLoad from "@fastify/autoload";
import fastify from "fastify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const app = fastify({
  logger: {
    level: "info",
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

app.listen({ port: app.config.PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
