import { FastifyInstance } from 'fastify';
import { loginHandler, registerHandler } from '../controllers/auth.js';
import { LoginRequestSchema, RegisterRequestSchema, LoginResponseSchema, RegisterResponseSchema } from '../schemas/auth.js';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
      '/login',
      {
        schema: {
          body: LoginRequestSchema,
          response: {
            200: LoginResponseSchema,
          },
        },
      },
      loginHandler
    );
  
    fastify.post(
      '/register',
      {
        schema: {
          body: RegisterRequestSchema,
          response: {
            200: RegisterResponseSchema,
          },
        },
      },
      registerHandler
    );

    fastify.get('/logout', fastify.authService.logout)
  }