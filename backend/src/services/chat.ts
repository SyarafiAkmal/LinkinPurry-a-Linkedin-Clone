// import { FastifyInstance } from 'fastify';
import { WebSocket } from '@fastify/websocket';
import { Static } from '@sinclair/typebox';
import { ChatSchema } from '../schemas/chat.js';
import { FastifyRequest, FastifyInstance } from 'fastify';

export function createChatService(fastify: FastifyInstance) {
    return{
        async sendChat(
            request: FastifyRequest,
            connection: WebSocket // variabel socket suatu client
        ) {
            connection.on('message', async (rawMessage: string) => {
                const parsedMessage: Static<typeof ChatSchema> = JSON.parse(rawMessage);
                const target_client = request.server.clients.get(parsedMessage.to_id);
                const fromId = parsedMessage.from_id;
                const toId = parsedMessage.to_id;
                console.log(fromId, toId);
                const isConnected = await request.server.profileService.isConnected(BigInt(fromId), BigInt(toId));
                // console.log(isConnected);
                if(target_client && isConnected){
                    parsedMessage.timestamp = (new Date()).toISOString()
                    target_client.send(JSON.stringify({
                        status: 'success',
                        receivedMessage: parsedMessage
                    }));
                } else {
                    connection.send(JSON.stringify({
                        status: 'Unauthorized',
                        receivedMessage: 'This person isn\'t connected to you.'
                    }));
                }
                
                await request.server.prisma.chat.create({
                    data: {
                      from_id: parseInt(parsedMessage.from_id, 10),
                      to_id: parseInt(parsedMessage.to_id, 10),
                      message: parsedMessage.message,
                      timestamp: parsedMessage.timestamp,
                    },
                });
            });
        },

        async getChat(
            id: string
        ) {
            const userId = parseInt(id, 10);
            if (isNaN(userId)) {
                throw new Error("Invalid user ID");
            }

            const userChats = await fastify.prisma.chat.findMany({
                where: {
                  OR: [
                    { from_id: userId },
                    { to_id: userId },
                  ],
                },
              });
            
            return {
                chathistory: userChats
            };
        }
    }
}