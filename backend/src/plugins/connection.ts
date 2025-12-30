import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { createConnectionService } from '../services/connection.js';

export default fp(async function(fastify: FastifyInstance) {
  fastify.decorate('connectionService', createConnectionService(fastify));
});

declare module 'fastify' {
  interface FastifyInstance {
    connectionService: ReturnType<typeof createConnectionService>;
  }
}