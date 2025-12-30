import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { createChatService } from '../services/chat.js';
import { WebSocket } from '@fastify/websocket';

export default fp(async function(fastify: FastifyInstance) {
    fastify.decorate('chatService', createChatService(fastify));
    fastify.decorate('clients', new Map<string, WebSocket>());
});

declare module 'fastify' {
    interface FastifyInstance {
        chatService: ReturnType<typeof createChatService>;
        clients: Map<string, WebSocket>;
    }
}