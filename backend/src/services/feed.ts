import { FastifyInstance } from 'fastify';
// import { ResponseFeedSchema } from '../schemas/feed.js';
// import { Static } from '@sinclair/typebox';

type PrismaFeed = {
    id: bigint;
    created_at: Date;
    updated_at: Date;
    content: string;
    user_id: bigint;
    users: { username: string };
};

export function createFeedService(fastify: FastifyInstance) {
    // type PrismaFeed = NonNullable<Awaited<ReturnType<typeof fastify.prisma.feed.findFirst>>>;
    // type PrismaConnection = NonNullable<Awaited<ReturnType<typeof fastify.prisma.connection.findFirst>>>;
    return {
        async getFeed(requesterId: bigint, cursor: bigint | undefined, limit: number | undefined)  {
            // const cacheKey = `feed:${requesterId}:${cursor || 'start'}:${limit || 'default'}`;

            // // cari di cache dulu
            // const cachedFeed = await fastify.cache.get<{
            //     body: Array<{
            //         id: string;
            //         created_at: string;
            //         updated_at: string;
            //         content: string;
            //         author: string;
            //     }>;
            //     nextCursor: string | null;
            // }>(cacheKey);

            // if (cachedFeed) {
            //     return cachedFeed;
            // }

            console.log('db');

            // baru kemudian cari di db
            const connected_user = await fastify.profileService.getConnections(requesterId);
            let feed;

            if (connected_user.length === 0) {
                feed = await fastify.prisma.feed.findMany({
                    where: {
                        user_id: requesterId,
                    },
                    include: {
                        users: {
                            select: {
                                username: true,
                            },
                        },
                    },
                    orderBy: {
                        created_at: 'desc',
                    },
                    take: limit ? limit + 1 : undefined,
                    cursor: cursor ? { id: cursor } : undefined,
                });
            } else {
                feed = await fastify.prisma.feed.findMany({
                    where: {
                        OR: [
                            { user_id: requesterId },
                            { user_id: { in: connected_user } },
                        ],
                    },
                    include: {
                        users: {
                            select: {
                                username: true,
                            },
                        },
                    },
                    orderBy: {
                        created_at: 'desc',
                    },
                    take: limit ? limit + 1 : undefined,
                    cursor: cursor ? { id: cursor } : undefined,
                });
            }            
            
            if (feed.length === 0) {
                return null;
            }
            
            let lastCursorId = feed[feed.length - 1].id.toString() || null;

            if (limit && limit >= feed.length) {
                lastCursorId = null;
            }

            if (limit) {
                feed.pop();
            }

            const responseFeed = feed.map((item: PrismaFeed) => ({
                id: item.id.toString(),
                created_at: item.created_at.toISOString(),
                updated_at: item.updated_at.toISOString(),
                content: item.content,
                author: item.users.username
            }));

            const result = {
                body: responseFeed,
                nextCursor: lastCursorId
            };

            // simpan di cache
            // await fastify.cache.set(cacheKey, result, 300);

            return  result;
        },

        async createFeed(requesterId: bigint, content: string) {
            try {
                const createdFeed = await fastify.prisma.feed.create({
                  data: {
                    user_id: requesterId,
                    content: content,
                    created_at: new Date(),
                    updated_at: new Date(),
                  },
                  include: {
                    users: {
                        select: {
                            full_name: true,
                        },
                    },
                  },
                });
                const responseFeed = {
                    id: createdFeed.id.toString(),
                    created_at: createdFeed.created_at.toISOString(),
                    updated_at: createdFeed.updated_at.toISOString(),
                    content: createdFeed.content,
                    author: createdFeed.users.full_name
                };
                return responseFeed;
            } catch (error) {
                console.error('Error creating feed:', error);
                throw new Error('Failed to create feed');
            }
        },

        async isFeedOwner(user_id: bigint, feed_id: bigint): Promise<boolean> {
            try {
              const feed = await fastify.prisma.feed.findUnique({
                where: {
                  id: feed_id,
                },
                select: {
                  user_id: true,
                },
              });
              console.log(feed?.user_id === user_id)

              return feed?.user_id === user_id;
            } catch (error) {
              console.error("Error checking feed ownership:", error);
              return false;
            }
        },

        async updateFeed(identifier: bigint, content: string) {
            const updatedFeed = await fastify.prisma.feed.update({
                where: {
                    id: identifier,
                },
                data: {
                    content: content,
                    updated_at: new Date(),
                },
                include: {
                    users: {
                        select: {
                            full_name: true,
                        },
                    },
                },
            });

            const responseFeed = {
                id: updatedFeed.id.toString(),
                created_at: updatedFeed.created_at.toISOString(),
                updated_at: updatedFeed.updated_at.toISOString(),
                content: updatedFeed.content,
                author: updatedFeed.users.full_name
            };
            
            // const connected_user = await fastify.profileService.getConnections(updatedFeed.user_id);

            // await fastify.cache.invalidateFeedCache(updatedFeed.user_id, identifier, connected_user);

            return responseFeed;
        },

        async deleteFeed(identifier: bigint) {
            const feed = await fastify.prisma.feed.findUnique({
                where: { id: identifier },
                select: { user_id: true }
            });

            await fastify.prisma.feed.delete({
                where: {
                    id: identifier,
                },
            });

            // if (feed) {
            //     const connected_user = await fastify.profileService.getConnections(feed.user_id);
            //     await fastify.cache.invalidateFeedCache(feed.user_id, identifier, connected_user);
            // }

        },
    }
}