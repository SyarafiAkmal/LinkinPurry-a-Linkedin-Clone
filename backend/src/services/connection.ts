import { FastifyInstance } from 'fastify';
import { Static } from '@sinclair/typebox';
import { UserSchema } from '../schemas/connection.js';
import { InvariantError } from '../errors/InvariantError.js';

export function createConnectionService(fastify: FastifyInstance) {
    return {
        async createConnectionRequest(from_id: bigint, to_id: bigint) {
            const existingRequest = await fastify.prisma.connection_request.findUnique({
                where: {
                    from_id_to_id: { 
                        from_id, 
                        to_id 
                    },
                },
            });
        
            if (existingRequest) {
                throw new InvariantError(`Connection request between user ${from_id} and user ${to_id} already exists.`)
            }
        
            const newRequest = await fastify.prisma.connection_request.create({
                data: {
                    from_id,
                    to_id,
                    created_at: new Date(),
                },
            });

            return newRequest;
        },
        async getUserConnections(userId: string): Promise<{
            id: string;
            full_name: string | null;
            profile_photo_path: string;
        }[]> {
            const userIdInt = BigInt(userId);

            const connections = await fastify.prisma.connection.findMany({
                where: {
                    OR: [
                        { from_id: userIdInt },
                        { to_id: userIdInt }
                    ]
                }
            });
            console.log(connections);

            const userConnections = [];

            for (let i = 0; i < connections.length; i++) {
                const otherUserId = connections[i].from_id === userIdInt ? connections[i].to_id : connections[i].from_id;

                const user = await fastify.prisma.users.findUnique({
                    where: {
                        id: otherUserId
                    },
                    select: {
                        id: true,
                        full_name: true,
                        profile_photo_path: true,
                    }
                });

                if (user !== null) {
                    userConnections.push({
                        id: user.id.toString(),
                        full_name: user.full_name,
                        profile_photo_path: user.profile_photo_path,
                    });
                }
            }

            return userConnections;
        },
        async getConnectionRequests(userId: string) {
            const userConnectionRequests = await fastify.prisma.connection_request.findMany({
                where: {
                    to_id: parseInt(userId, 10),
                },
                orderBy: {
                    created_at: 'desc',
                },
            })
        
            const userConnected: Static<typeof UserSchema>[] = []
        
            for (let i = 0; i < userConnectionRequests.length; i++) {
                const user = await fastify.prisma.users.findUnique({
                    where: {
                        id: userConnectionRequests[i].from_id,
                    },
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        work_history: true,
                        skills: true,
                    }
                });
            
                if (user !== null) {
                    userConnected.push({
                        id: user.id.toString(),
                        username: user.username,
                        email: user.email,
                        work_history: user.work_history,
                        skills: user.skills,
                    });
                }
            }

                return userConnected;
        },
        async acceptConnectionRequest(from_id:bigint, to_id: bigint) {            
            const existingConnection = await fastify.prisma.connection.findUnique({
                where: {
                    from_id_to_id: { 
                        from_id, 
                        to_id 
                    },
                },
            });

            await fastify.prisma.connection_request.delete({
                where: {
                    from_id_to_id: {
                        from_id,
                        to_id,
                    },
                },
            });
        
            if (existingConnection) {
                throw new InvariantError("Connection already exists!");
            }

            await fastify.prisma.connection.create({
                data: {
                    from_id,
                    to_id,
                    created_at: new Date(),
                },
            });

            return true;
        },
        async declineConnectionRequest(from_id:bigint, to_id: bigint) {         
            const existingRequest = await fastify.prisma.connection_request.findUnique({
                where: {
                    from_id_to_id: { 
                        from_id, 
                        to_id 
                    },
                },
            });
        
            if (!existingRequest) {
                throw new Error("Connection request not found");
            }

            await fastify.prisma.connection_request.delete({
                where: {
                    from_id_to_id: {
                        from_id,
                        to_id,
                    },
                },
            });

            return true;
        },
        async deleteConnection(from_id: bigint, to_id: bigint) {
            const existingConnection = await fastify.prisma.connection.findFirst({
                where: {
                    OR: [
                        { from_id, to_id },
                        { from_id: to_id, to_id: from_id }
                    ],
                },
            });
        
            if (!existingConnection) {
                throw new Error("Connection not found");
            }
        
            await fastify.prisma.connection.delete({
                where: {
                    from_id_to_id: {
                        from_id: existingConnection.from_id,
                        to_id: existingConnection.to_id,
                    },
                },
            });
        
            return true;
        }        
    };
}