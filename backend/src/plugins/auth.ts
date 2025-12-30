import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { createAuthService } from '../services/auth.js';
import { FastifyReply, FastifyRequest } from 'fastify';

export default fp(async function (fastify: FastifyInstance) {
    fastify.decorate(
        'authenticate',
        async function (request: FastifyRequest, reply: FastifyReply) {
          try {
            await request.jwtVerify();
          } catch (err) {
            reply.status(401).send({
              error: err,
              message: 'Invalid or missing token',
            });
          }
        }
      );
  fastify.decorate('authService', createAuthService(fastify));

  const blacklist = new Set<string>();
  fastify.decorate('blacklist', blacklist);
});

declare module 'fastify' {
  interface FastifyInstance {
    authService: ReturnType<typeof createAuthService>;
  }
}


declare module 'fastify' {
  interface FastifyInstance {
      authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    blacklist: Set<string>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string;
      email: string;
      role: string;
      iat: number;
      exp: number;
    };
    user: {
      userId: string;
      email: string;
      role: string;
    };
  }
}