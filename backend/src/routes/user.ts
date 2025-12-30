import { FastifyInstance } from "fastify";
import { UserListSchema, UserSchema } from "../schemas/user.js";
import { getCurrentUserHandler,  getAllUsersHandler } from "../controllers/user.js";
import { Type } from "@sinclair/typebox";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users/me', {
    schema: {
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          message: Type.String(),
          body: UserSchema,
        }),
      },
    },
    handler: getCurrentUserHandler,
  });

  fastify.get('/users', {
    schema: {
      querystring: Type.Object({
        search: Type.Optional(Type.String()),
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          message: Type.String(),
          body: UserListSchema,
        }),
      },
    },
    handler: getAllUsersHandler,
  });

  fastify.get('/health', {
    schema: {
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          message: Type.String(),
        }),
      },
    },
    handler: async () => {
      return {
        success: true,
        message: 'Service is healthy',
      };
    },
  });

}
