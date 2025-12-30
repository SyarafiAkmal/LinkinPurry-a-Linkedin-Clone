import { FastifyInstance } from "fastify";
import { UserSchema } from '../schemas/user.js';
import { Static } from '@sinclair/typebox';

export function createUserService(fastify: FastifyInstance) {
  // type PrismaUser = NonNullable<Awaited<ReturnType<typeof fastify.prisma.users.findFirst>>>;
    return {
      async getUserById(id: bigint) {
        const user = await fastify.prisma.users.findUnique({
          where: { id: id },
        });

        if (user) {
          return {
            id: user.id.toString(),
            full_name: user.full_name,
            profile_photo_path: user.profile_photo_path || undefined,
          };
        } else {
          return null;
        }
      },

      async getAllUsers(search?: string) {
        const users = await fastify.prisma.users.findMany({
          where: search
            ? {
                full_name: {
                  contains: search,
                  mode: 'insensitive',
                },
              }
            : undefined,
        });

        const mappedUsers = users.map((user: Static<typeof UserSchema>) => ({
          id: user.id.toString(),
          full_name: user.full_name,
          profile_photo_path: user.profile_photo_path || undefined,
        }));

        return {
          users: mappedUsers,
        };
      },
    };
}