import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { createFeedService } from '../services/feed.js';

export default fp(async function (fastify: FastifyInstance) {
  fastify.decorate('feedService', createFeedService(fastify));
});

declare module 'fastify' {
  interface FastifyInstance {
    feedService: ReturnType<typeof createFeedService>;
  }
}