import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { createImageHandlerService } from '../services/imageHandler.js';

export default fp(async function (fastify: FastifyInstance) {
  fastify.decorate('imageHandlerService', createImageHandlerService());
});

declare module 'fastify' {
  interface FastifyInstance {
    imageHandlerService: ReturnType<typeof createImageHandlerService>;
  }
}