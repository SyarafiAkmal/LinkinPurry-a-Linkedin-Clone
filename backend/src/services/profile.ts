import { FastifyInstance } from 'fastify';
import { ProfilePutRequestSchema, ProfileSchema, ProfileFeedSchema } from '../schemas/profile.js';
import { Static } from '@sinclair/typebox';
import { Multipart } from '@fastify/multipart';

export function createProfileService(fastify: FastifyInstance) {
    type PrismaConnection = NonNullable<Awaited<ReturnType<typeof fastify.prisma.connection.findFirst>>>;
  return {
    async getProfile(identifier: bigint, requesterId: bigint): Promise<Static<typeof ProfileSchema>> {
        const user = await fastify.prisma.users.findFirst({
          where: {
           id: identifier
          },
        });
      
        if (!user) {
          throw new Error('User not found');
        }

        let isOwner: boolean = false;
        let isConnected: boolean = false;

        const profile: Static<typeof ProfileSchema> = {
          username: user.username,
          name: user.full_name,
          work_history: user.work_history,
          skills: user.skills,
          connection_count: await this.getConnectionCount(identifier),
          profile_photo: user.profile_photo_path,
        };
        console.log('unauthenticated');
        
        if (requesterId) {
          isOwner = identifier === requesterId;
          if (! await this.isRequestConnection(identifier, requesterId) && !isOwner) {
            profile.isButton = true;
          }
          if (await this.isRequestConnection(identifier, requesterId) && !isOwner) {
            profile.isButton = false;
          }
          console.log('logged in');
          isConnected = await this.isConnected(identifier, requesterId);
          profile.relevant_posts = await this.getRelevantPosts(user.id);
        }
        
        if (isConnected) {
          profile.isButton = false;
          console.log('connected');
        }
        
        if (isOwner) {
          console.log('owner');
          profile.skills = user.skills;
          profile.relevant_posts = await this.getRelevantPosts(user.id);
          profile.email = user.email;
        }

        return profile;
    },

    async isConnected(identifier: bigint, requesterId: bigint): Promise<boolean> {
        const isConnected = await fastify.prisma.connection.findMany({
            where: {
              OR: [
                { from_id: requesterId, to_id: identifier },
                { from_id: identifier, to_id: requesterId },
              ],
            },
          });
        return (isConnected !== null && isConnected.length === 1);
    },

    async isRequestConnection(identifier: bigint, requesterId: bigint): Promise<boolean> {
        const isRequestConnection = await fastify.prisma.connection_request.findFirst({
            where: {
              OR: [
                { from_id: requesterId, to_id: identifier },
                { from_id: identifier, to_id: requesterId },
              ],
            },
          });
        return isRequestConnection !== null;;
    },

    async getConnectionCount(userId: bigint): Promise<number> {
        const fromConnections = await fastify.prisma.connection.count({
          where: {
            from_id: userId,
          },
        });
      
        const toConnections = await fastify.prisma.connection.count({
          where: {
            to_id: userId,
          },
        });

        return fromConnections + toConnections;
    },

    async getRelevantPosts(userId: bigint): Promise<Static< typeof ProfileFeedSchema>[]> {
        const posts = await fastify.prisma.feed.findMany({
          where: {
            user_id: userId
          },
        });
        const relevantPosts = posts.map((item: {
          id: bigint;
          created_at: Date;
          updated_at: Date;
          content: string;
          user_id: bigint;
        }) => ({
          id: item.id.toString(),
          created_at: item.created_at.toISOString(),
          updated_at: item.updated_at.toISOString(),
          content: item.content,
        }));
        return relevantPosts;
    },

    async getConnections(userId: bigint): Promise<bigint[]> {
        const connections = await fastify.prisma.connection.findMany({
          where: {
            OR: [
              { from_id: userId },
              { to_id: userId },
            ],
          },
        });

        return connections.map((connection: PrismaConnection) => 
          connection.from_id === userId ? connection.to_id : connection.from_id
        );
      },

    async updateProfile(identifier: bigint, requesterId: bigint, data: AsyncIterableIterator<Multipart>): Promise<Static<typeof ProfilePutRequestSchema>> {
      const isOwner: boolean = identifier === requesterId;

      if (!isOwner) {
        throw new Error('Unauthorized');
      }

      let name: string = "";
      let username: string = "";
      let work_history: string = "";
      let skills: string = "";
      let photoURL: string = "";

      try {
        for await (const part of data) {
          if (part.type === 'file' && part.fieldname === 'profile_photo') {
            if (part?.filename) {
              photoURL = await fastify.imageHandlerService.uploadImage(part);
            }
          } else if (part.type === 'field') {
            if (part.fieldname === 'username') username = part.value as string;
            if (part.fieldname === 'name') name = part.value as string;
            if (part.fieldname === 'work_history') work_history = part.value as string;
            if (part.fieldname === 'skills') skills = part.value as string;
          }
        }
      } catch (error) {
        console.error('Error processing multipart data:', error);
      }
      
      let user;

      if (photoURL) {
        user = await fastify.prisma.users.update({
          where: {
            id: identifier,
          },
          data: {
            full_name: name,
            username: username,
            profile_photo_path: photoURL,
            work_history: work_history,
            skills: skills,
          },
        });
      } else {
        user = await fastify.prisma.users.update({
          where: {
            id: identifier,
          },
          data: {
            full_name: name,
            username: username,
            work_history: work_history,
            skills: skills,
          },
        });
      }

      if (!user) {
        throw new Error('User not found or update failed');
      }

      return {
        username: user.username,
        name: user.full_name,
        profile_photo: user.profile_photo_path,
        work_history: user.work_history,
        skills: user.skills,
      };
    },
  };
}