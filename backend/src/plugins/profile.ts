import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { createProfileService } from '../services/profile.js';

export default fp(async function (fastify: FastifyInstance) {
  fastify.decorate('profileService', createProfileService(fastify));
});

declare module 'fastify' {
  interface FastifyInstance {
    profileService: ReturnType<typeof createProfileService>;
  }
}