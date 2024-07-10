'use strict'

import { FastifyInstance } from "fastify"
import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

declare module 'fastify' {
  interface FastifyInstance {
    config: { // this should be same as the confKey in options
      // specify your typing here
      PORT: number
    };
  }
}

const schema = {
  type: 'object',
  required: [ 'PORT' ],
  properties: {
    PORT: {
      type: "number",
      default: 3000
    }
  }
}

export default fp(async function (fastify: FastifyInstance) {
  fastify.register(fastifyEnv, {
    schema,
    dotenv: {
      path: join(__dirname, '../../.env'),
      debug: true,
      encoding: 'utf8'
    },
  }).ready((err) => {
    if (err) console.error(err);
  })
})
