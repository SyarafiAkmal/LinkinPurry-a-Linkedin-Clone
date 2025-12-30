import { FastifyRequest, FastifyReply } from 'fastify';
import { getRequesterIdFromToken } from '../utils/token.js';
import { WebSocket } from '@fastify/websocket';

export async function chatWSHandler(
    request: FastifyRequest,
    connection: WebSocket,
) {
    // await request.jwtVerify();
    await request.server.chatService.sendChat(request, connection);
}

export async function getChatHandler(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    const { id } = request.params as { id: string };
    const chatList = await request.server.chatService.getChat(id);
    reply.send(chatList);
}
