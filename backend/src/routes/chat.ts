import { FastifyInstance, FastifyRequest } from 'fastify';
import { chatWSHandler, getChatHandler } from '../controllers/chat.js';
import { ChatListSchema } from '../schemas/chat.js';

export default async function chatRoutes(fastify: FastifyInstance) {
    fastify.get('/chat/:id', {
      websocket: true,
    }, (connection, request: FastifyRequest<{ Params: { id: string } }>) => {
      request.server.clients.set(request.params.id, connection);
      chatWSHandler(request, connection);
    });

    fastify.get('/chat-history/:id', {
      schema: {
        response: {
          200: ChatListSchema,
        },
      },
      handler: getChatHandler,
    });
}