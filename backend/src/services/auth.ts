import bcrypt from 'bcrypt';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { RegisterRequestSchema } from '../schemas/auth.js';
import { Static } from '@sinclair/typebox';

export function createAuthService(fastify: FastifyInstance) {
  type PrismaUser = NonNullable<Awaited<ReturnType<typeof fastify.prisma.users.findFirst>>>;
  async function generateToken(user: PrismaUser): Promise<string> {
    console.log("User id: ", user.id);
    const payload = {
      userId: user.id.toString(),
      email: user.email,
      role: 'user',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    console.log("User id: ", user.id);

    return fastify.jwt.sign(payload);
  }
  
  const isValidUsername = (username: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(username);
  }

  return {
    async login(identifier: string, password: string): Promise<string> {
      const user = await fastify.prisma.users.findFirst({
        where: {
          OR: [{ email: identifier }, { username: identifier }],
        },
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      return generateToken(user);
    },
    

    async register(data: Static<typeof RegisterRequestSchema>): Promise<string> {
      const existingUser = await fastify.prisma.users.findFirst({
        where: {
          OR: [{ email: data.email }, { username: data.username }],
        },
      });

      if (!isValidUsername(data.username)) {
        throw new Error('Invalid username format');
      }

      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await fastify.prisma.users.create({
        data: {
          username: data.username,
          email: data.email,
          full_name: data.name,
          password_hash: hashedPassword,
          profile_photo_path: 'default.jpg',
          updated_at: new Date(),
        },
      });

      return generateToken(user);
    },

    async logout(request: FastifyRequest, reply: FastifyReply) : Promise<void> {
      const token = request.cookies.token;
      if (token) {
        fastify.blacklist.add(token);
      }
      reply.clearCookie('token').send({ success: true, message: 'Logged out successfully '});
    }
  };
}