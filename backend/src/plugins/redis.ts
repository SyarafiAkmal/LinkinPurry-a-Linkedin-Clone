import { FastifyPluginAsync } from 'fastify';
// import fastifyRedis from '@fastify/redis';
import { Redis } from 'ioredis';

const createRedisClient = () => {
  return new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    // add password klo butuh
    // password: process.env.REDIS_PASSWORD,
    
    connectTimeout: 5000,
    maxRetriesPerRequest: 3,
    autoResendUnfulfilledCommands: true,
    
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });
};

const createCacheUtility = (redis: Redis) => ({
  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await redis.set(key, stringValue, 'EX', ttl);
    } else {
      await redis.set(key, stringValue);
    }
  },

  async get<T = unknown>(key: string): Promise<T | null> {
    const cachedValue = await redis.get(key);
    return cachedValue ? JSON.parse(cachedValue) : null;
  },

  async delByPattern(pattern: string) {
    await this.deleteRedisCacheByPattern(redis, pattern);
  },

  // Bulk deletion method
  async del(...keys: string[]) {
      if (keys.length > 0) {
          await redis.del(...keys);
      }
  },

  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
  },

  async deleteRedisCacheByPattern(redis: Redis, pattern: string) {
    try {
        let cursor = '0';
        do {
            const [newCursor, keys] = await redis.scan(
                cursor, 
                'MATCH', pattern,
                'COUNT', 1000
            );

            if (keys.length > 0) {
                await redis.del(...keys);
            }

            cursor = newCursor;
        } while (cursor !== '0');
    } catch (error) {
        console.error(`Error deleting keys with pattern ${pattern}:`, error);
        throw error;
    }
  },

  async invalidateFeedCache(userId: bigint, specificFeedId?: bigint, connected_user?: bigint[]) {
    try {
        // Prepare cache key patterns
        const userFeedKeyPatterns = [
            `feed:${userId}:*`,
            `feed:${userId}:undefined:*`,
        ];

        if (connected_user) {
          connected_user.forEach(connectedUserId => {
              userFeedKeyPatterns.push(`feed:${connectedUserId}:*`);
          });
        }

        for (const pattern of userFeedKeyPatterns) {
            await this.delByPattern(pattern);
        }

        if (specificFeedId) {
            const specificFeedKeyPatterns = [
                `feed:*:${specificFeedId}`,
                `feed_details:${specificFeedId}`,
            ];

            for (const pattern of specificFeedKeyPatterns) {
                await this.delByPattern(pattern);
            }
        }

        console.log(`Cache invalidated for user ${userId}${specificFeedId ? ` and feed ${specificFeedId}` : ''}`);
    } catch (error) {
        console.error({
            msg: 'Error invalidating feed cache',
            userId,
            specificFeedId,
            error: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
  },
});

const redisPlugin: FastifyPluginAsync = async (fastify) => {
  const redis = createRedisClient();

  redis.on('connect', () => {
    fastify.log.info('Redis client connected');
  });

  redis.on('error', (err) => {
    fastify.log.error('Redis client error', err);
  });

  fastify.decorate('redis', redis);
  fastify.decorate('cache', createCacheUtility(redis));

  fastify.addHook('onClose', async () => {
    await redis.quit();
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis;
    cache: ReturnType<typeof createCacheUtility>;
  }
}

export default redisPlugin;