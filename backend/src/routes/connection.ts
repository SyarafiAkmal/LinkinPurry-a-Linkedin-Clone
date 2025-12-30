import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { createConnectionRequestHandler, getConnectionRequestsHandler, getUserConnectionsHandler, acceptConnectionRequestHandler, declineConnectionRequestHandler, getMyConnectionsHandler, deleteConnectionHandler } from '../controllers/connection.js'
import { ConnectionRequestRequestSchema, ConnectionRequestResponseSchema, ConnectionRequestsResponseSchema, UserConnectionsResponseSchema } from '../schemas/connection.js';

export default async function connectionRoutes(fastify: FastifyInstance) {
  fastify.post('/connection-requests', {
    schema: {
      body: ConnectionRequestRequestSchema,
      response: {
        200: ConnectionRequestResponseSchema,
      },
    },
    handler: createConnectionRequestHandler,
  });

  fastify.get('/connection-requests', {
    schema: {
      response: {
        200: ConnectionRequestsResponseSchema,
      },
    },
    handler: getConnectionRequestsHandler,
  });

  fastify.post('/connection-requests/:toId/accept', {
    schema: {
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          message: Type.String(),
        }),
      },
    },
    handler: acceptConnectionRequestHandler,
  });

  fastify.post('/connection-requests/:toId/decline', {
    schema: {
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          message: Type.String(),
        }),
      },
    },
    handler: declineConnectionRequestHandler,
  });

  fastify.get('/connections', {
    schema: {
      response: {
        200: UserConnectionsResponseSchema,
      },
    },
    handler: getMyConnectionsHandler,
  });

  fastify.get('/connections/:userId', {
    schema: {
      response: {
        200: UserConnectionsResponseSchema,
      },
    },
    handler: getUserConnectionsHandler,
  });
  
  fastify.delete('/connections/:toId', {
    schema: {
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          message: Type.String(),
        }),
      },
    },
    handler: deleteConnectionHandler,
  })
}
