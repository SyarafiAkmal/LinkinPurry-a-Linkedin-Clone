import { FastifyInstance } from 'fastify';
import { getFeedHandler, createFeedHandler, updateFeedHandler, deleteFeedHandler } from '../controllers/feed.js';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Static} from '@sinclair/typebox';
import { FeedSchema } from '../schemas/feed.js';

interface FeedQuery {
  cursor?: string;
  limit?: number;
}

async function feedRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/feed',
    {
      preHandler:
      async function (request: FastifyRequest<{ Querystring: FeedQuery }>, reply: FastifyReply) {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.status(401).send({
            error: err,
            message: 'Invalid or missing token',
          });
        }
      }
    },
    getFeedHandler
  );

  fastify.post(
    '/feed',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            content: { type: 'string' },
          },
          required: ['content'],
        }
      },
      preHandler:
      async function (request: FastifyRequest<{ Body: Static<typeof FeedSchema> }>, reply: FastifyReply) {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.status(401).send({
            error: err,
            message: 'Invalid or missing token',
          });
        }
      }
    },
    createFeedHandler
  );

  fastify.put(
    '/feed/:identifier',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            identifier: { type: 'string' },
          },
          required: ['identifier'],
        },
        body: {
          type: 'object',
          properties: {
            content: { type: 'string' },
          },
          required: ['content'],
        }
      },
      preHandler:
      async function (request: FastifyRequest<{ Body: Static<typeof FeedSchema> }>, reply: FastifyReply) {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.status(401).send({
            error: err,
            message: 'Invalid or missing token',
          });
        }
      }
    },
    updateFeedHandler
  );

  fastify.delete(
    '/feed/:identifier',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            identifier: { type: 'string' },
          },
          required: ['identifier'],
        }
      },
      preHandler:
      async function (request: FastifyRequest<{ Params: { identifier: string } }>, reply: FastifyReply) {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.status(401).send({
            error: err,
            message: 'Invalid or missing token',
          });
        }
      }
    },
    deleteFeedHandler
  );
}

export default feedRoutes;