import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { createUserService } from '../services/user.js';

export default fp(async function(fastify: FastifyInstance) {
  fastify.decorate('userService', createUserService(fastify));
});

declare module 'fastify' {
  interface FastifyInstance {
    userService: ReturnType<typeof createUserService>;
  }
}