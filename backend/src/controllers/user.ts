import { FastifyReply, FastifyRequest } from "fastify";
import { getRequesterIdFromToken } from "../utils/token.js";
import { AuthenticationError } from "../errors/AuthenticationError.js";

export async function getCurrentUserHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const requesterId = await getRequesterIdFromToken(request);

        if (requesterId == "") {
            throw new AuthenticationError("Invalid JWT Token Payload")
        }

        const userId = BigInt(requesterId);
        const user = await request.server.userService.getUserById(userId);

        reply.send({
            success: true,
            message: 'User fetched successfully',
            body: user
        })
    } catch (error) {
        if (error instanceof Error) {
            reply.status(400).send({
            success: false,
            message: error.message || 'Failed to fetch users',
            });
        } else {
        reply.status(400).send({
            success: false,
            message: 'An unknown error occurred',
        });
        }
    }
}

export async function getAllUsersHandler(
    request: FastifyRequest<{ Querystring: { search?: string } }>,
    reply: FastifyReply
) {
    try {
        const requesterId = await getRequesterIdFromToken(request);
        
        if (requesterId == "") {
            throw new AuthenticationError("Invalid JWT Token Payload")
        }

        const { search } = request.query;

        const users = await request.server.userService.getAllUsers(search);
        reply.send({
            success: true,
            message: 'Users fetched successfully',
            body: users,
        })
    } catch (error) {
        if (error instanceof Error) {
            reply.status(400).send({
              success: false,
              message: error.message || 'Failed to fetch users',
            });
        } else {
        reply.status(400).send({
            success: false,
            message: 'An unknown error occurred',
        });
        }
    }
}
