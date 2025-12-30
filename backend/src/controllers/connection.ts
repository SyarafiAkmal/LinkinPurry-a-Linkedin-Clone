import {FastifyReply, FastifyRequest } from 'fastify';
import { getRequesterIdFromToken } from '../utils/token.js';
import { ConnectionRequestRequestSchema } from '../schemas/connection.js';
import { Static } from '@sinclair/typebox';

export async function createConnectionRequestHandler(
    request: FastifyRequest<{ Body: Static<typeof ConnectionRequestRequestSchema>}>,
    reply: FastifyReply
) {
    try {
        const requesterId = await getRequesterIdFromToken(request);
        
        const from_id = BigInt(requesterId);    
        const to_id = BigInt(request.body.to_id);

        const connectionRequest = await request.server.connectionService.createConnectionRequest(BigInt(from_id), BigInt(to_id));
        
        reply.send({
            success: true,
            message: 'Connection request sent successfully',
            body: connectionRequest,
        })
    } catch (error) {
        if (error instanceof Error) {
            reply.status(400).send({
              success: false,
              message: error.message || 'Failed to fetch create connection request',
            });
        } else {
        reply.status(400).send({
            success: false,
            message: 'An unknown error occurred',
        });
        }
    }
}

export async function getConnectionRequestsHandler(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    try {
        const userId = await getRequesterIdFromToken(request);
    
        const connectionRequests = await request.server.connectionService.getConnectionRequests(userId);

        reply.send({
            success: true,
            message: 'Connection requests fetched successfully',
            body: {
                users: connectionRequests
            },
        })
    } catch (error) {
        if (error instanceof Error) {
            reply.status(400).send({
              success: false,
              message: error.message || 'Failed to get connection requests',
            });
        } else {
        reply.status(400).send({
            success: false,
            message: 'An unknown error occurred',
        });
        }
    }
}

export async function getMyConnectionsHandler(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    try {
        const userId = await getRequesterIdFromToken(request);
        const userConnections = await request.server.connectionService.getUserConnections(userId);

        console.log(userConnections)
        reply.send({
            success: true,
            message: 'User\'s connections fetched successfully',
            body: {
                users: userConnections
            },
        })
    } catch (error) {
        if (error instanceof Error) {
            reply.status(400).send({
              success: false,
              message: error.message || 'Failed to fetch user\'s connections',
            });
        } else {
        reply.status(400).send({
            success: false,
            message: 'An unknown error occurred',
        });
        }
    }
}

export async function getUserConnectionsHandler(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply,
) {
    try {
        const {userId} = request.params;
        const userConnections = await request.server.connectionService.getUserConnections(userId);

        console.log(userConnections)
        reply.send({
            success: true,
            message: 'User\'s connections fetched successfully',
            body: {
                users: userConnections
            },
        })
    } catch (error) {
        if (error instanceof Error) {
            reply.status(400).send({
              success: false,
              message: error.message || 'Failed to fetch user\'s connections',
            });
        } else {
        reply.status(400).send({
            success: false,
            message: 'An unknown error occurred',
        });
        }
    }
}

export async function acceptConnectionRequestHandler(
    request: FastifyRequest<{ Params: { toId: string } }>,
    reply: FastifyReply
){
    try {

        const requesterId = await getRequesterIdFromToken(request);
        
        const toId = BigInt(requesterId);    
        const fromId = BigInt(request.params.toId);
        
        const success = await request.server.connectionService.acceptConnectionRequest(fromId, toId);
        reply.send({
            success: success,
            message: 'Connection request accepted'
        })
    } catch (error) {
        if (error instanceof Error) {
            reply.status(400).send({
              success: false,
              message: error.message || 'Failed to accept connection request',
            });
        } else {
        reply.status(400).send({
            success: false,
            message: 'An unknown error occurred',
        });
        }
    }
}

export async function declineConnectionRequestHandler(
    request: FastifyRequest<{ Params: { toId: string } }>,
    reply: FastifyReply
){
    try {

        const requesterId = await getRequesterIdFromToken(request);
        
        const toId = BigInt(requesterId);    
        const fromId = BigInt(request.params.toId);
        
        const success = await request.server.connectionService.declineConnectionRequest(fromId, toId);
        reply.send({
            success: success,
            message: 'Connection request declined'
        })
    } catch (error) {
        if (error instanceof Error) {
            reply.status(400).send({
              success: false,
              message: error.message || 'Failed to decline connection request',
            });
        } else {
        reply.status(400).send({
            success: false,
            message: 'An unknown error occurred',
        });
        }
    }
}

export async function deleteConnectionHandler(
    request: FastifyRequest<{ Params: { toId: string } }>,
    reply: FastifyReply
){
    try {

        const requesterId = await getRequesterIdFromToken(request);
        
        const fromId = BigInt(requesterId);    
        const toId = BigInt(request.params.toId);
        
        const success = await request.server.connectionService.deleteConnection(fromId, toId);
        reply.send({
            success: success,
            message: 'Connection deleted'
        })
    } catch (error) {
        if (error instanceof Error) {
            reply.status(400).send({
              success: false,
              message: error.message || 'Failed to delete connection request',
            });
        } else {
        reply.status(400).send({
            success: false,
            message: 'An unknown error occurred',
        });
        }
    }
}

export async function verifyUser (request: FastifyRequest, reply: FastifyReply)  {
    try {
      await request.jwtVerify();
      
      const { userId } = request.user as { userId: string };
      const { id } = request.params as { id: string };

      if (userId !== id) {
        return reply.status(403).send({ message: 'Unauthorized: ID mismatch' });
      }
    } catch (err) {
      return reply.status(401).send({ message: 'Authentication failed', error: err });
    }
};