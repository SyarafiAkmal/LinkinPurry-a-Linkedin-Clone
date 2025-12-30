import { FastifyInstance } from 'fastify';
import { getProfileHandler, updateProfileHandler } from '../controllers/profile.js';
// import { ProfileResponseSchema } from '../schemas/profile.js';

export default async function profileRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/profile/:identifier',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            identifier: { type: 'string' },
          },
          required: ['identifier'],
        }
      }
    },
    getProfileHandler
  );

  fastify.put(
    '/profile/:identifier',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            identifier: { type: 'string' },
          },
          required: ['identifier'],
        },
      },
    },
    updateProfileHandler
  );
}
