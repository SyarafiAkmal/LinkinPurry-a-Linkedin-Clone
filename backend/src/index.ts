import Fastify from "fastify";
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import WebSocket from "@fastify/websocket";
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import cors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import prismaPlugin from './plugins/prisma.js';
import authPlugin from './plugins/auth.js';
import userPlugin from './plugins/user.js';
import connectionPlugin from './plugins/connection.js';
import profilePlugin from './plugins/profile.js';
import imageHandlerPlugin from './plugins/imageHandler.js';
import feedPlugin from './plugins/feed.js';
import chatPlugin from './plugins/chat.js';
// import redisPLugin from './plugins/redis.js';
import pushNotificationPlugin from './plugins/pushNotification.js';
import authRoutes from './routes/auth.js';
import userRoutes from "./routes/user.js";
import connectionRoutes from "./routes/connection.js";
import profileRoutes from './routes/profile.js';
import feedRoutes from './routes/feed.js';
import chatRoutes from "./routes/chat.js";
import subscribeRoutes from "./routes/pushNotification.js";
import dotenv from 'dotenv';

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

fastify.withTypeProvider<TypeBoxTypeProvider>();

await fastify.register(prismaPlugin);

await fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'default',
  cookie: {
    cookieName: 'token',
    signed: false,
  }
});
await fastify.register(fastifyCookie);

await fastify.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

await fastify.register(WebSocket, {
  options: {
    maxPayload: 1048576
  }
});

await fastify.register(imageHandlerPlugin);
await fastify.register(authPlugin);
await fastify.register(userPlugin);
await fastify.register(connectionPlugin);
await fastify.register(profilePlugin);
await fastify.register(feedPlugin);
await fastify.register(chatPlugin);
await fastify.register(pushNotificationPlugin);
// await fastify.register(redisPLugin);

await fastify.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

await fastify.register(authRoutes, { prefix: '/api' });
await fastify.register(userRoutes, {prefix: '/api'});
await fastify.register(profileRoutes, { prefix: '/api' });
await fastify.register(feedRoutes, { prefix: '/api' });
await fastify.register(connectionRoutes, { prefix: '/api' });
await fastify.register(chatRoutes, { prefix: '/api' });
await fastify.register(subscribeRoutes, { prefix: '/api' });

const start = async () => {
  try {
    const address = await fastify.listen({
      port: 3000,
      host: '0.0.0.0',
    });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

const closeGracefully = async (signal: string) => {
  console.log(`Received signal to terminate: ${signal}`);
  await fastify.close();
  process.exit(0);
};

process.on('SIGINT', () => closeGracefully('SIGINT'));
process.on('SIGTERM', () => closeGracefully('SIGTERM'));
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  closeGracefully('uncaughtException');
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  closeGracefully('unhandledRejection');
});

start();