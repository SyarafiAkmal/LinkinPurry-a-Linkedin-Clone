import { FastifyReply, FastifyRequest } from 'fastify';
import { Static} from '@sinclair/typebox';
import { LoginRequestSchema, RegisterRequestSchema } from '../schemas/auth.js';
import '@fastify/cookie'; 

export async function loginHandler(
  request: FastifyRequest<{ Body: Static<typeof LoginRequestSchema>}>,
  reply: FastifyReply
) {
  const { identifier, password } = request.body;
    
  try {
    const token = await request.server.authService.login(identifier, password);

    // harusnya bentukan subscription tuh ky yg ada di schema, gw bingung ditaruh di request mana
    // const subscription = request.body;
    // request.server.pushNotificationService.addSubscription(subscription);

    reply
      .setCookie('token', token, {
        path: '/',
        // secure: process.env.NODE_ENV === 'production' && process.env.HTTPS_ENABLED === 'true',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 3600,
      })
      .send({
        success: true,
        message: 'Login successful',
        body: { token },
      });
  } catch (error) {
    if (error instanceof Error) {
        reply.status(400).send({
          success: false,
          message: error.message || 'Invalid credentials',
        });
    } else {
    reply.status(400).send({
        success: false,
        message: 'An unknown error occurred',
    });
    }
  }
}

export async function registerHandler(
  request: FastifyRequest<{ Body: Static<typeof RegisterRequestSchema> }>,
  reply: FastifyReply
) {
  const { username, email, name, password } = request.body;

  try {
    const token = await request.server.authService.register({ username, email, name, password });

    reply
      .setCookie('token', token, {
        path: '/',
        secure: true,
        // secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 3600,
      })
      .send({
        success: true,
        message: 'Registration successful',
        body: { token },
      });
  } catch (error) {
    if (error instanceof Error) {
        reply.status(400).send({
          success: false,
          message: 'Failed to register user: ' + error.message,
        });
      } else {
        console.error('Unknown Error:', error); //nanti diiliangin
        reply.status(400).send({
          success: false,
          message: 'An unknown error occurred',
        });
      }
  }
}