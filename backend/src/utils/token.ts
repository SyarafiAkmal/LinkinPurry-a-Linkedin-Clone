import { FastifyRequest } from 'fastify';

export async function getRequesterIdFromToken(request: FastifyRequest): Promise<string> {
  let requesterId: string = "";

  try {
    const token = request.cookies.token;

    if (token) {
      await request.jwtVerify();
      requesterId = request.user.userId;
    }
  } catch (err) {
    requesterId = "";
  }

  return requesterId;
}
