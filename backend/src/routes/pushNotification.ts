import { FastifyInstance } from 'fastify';
import { addSubscription } from '../controllers/pushNotification.js';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
      '/subscribe',
      addSubscription
    );
  }