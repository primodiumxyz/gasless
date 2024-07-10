'use strict'

import { FastifyInstance } from "fastify"

export default async function routes (fastify: FastifyInstance) {
  fastify.get('/', async function (request, reply) {
    return { status: "OK" }
  })
}
