import { FastifyReply, FastifyRequest } from 'fastify';
import webpush from 'web-push';
import { getRequesterIdFromToken } from '../utils/token.js';

export async function addSubscription(
  request: FastifyRequest<{ Body: webpush.PushSubscription }>,
  reply: FastifyReply
) {
  try {
    const subscription = request.body;
    if (!subscription) {
      return reply.status(400).send({ error: 'Subscription data is missing' });
    }

    const userId = await getRequesterIdFromToken(request);
    await request.server.pushNotificationService.addSubscription(subscription, userId);

    reply.status(201).send({ message: 'Subscription added successfully' });

  } catch (error) {
    console.error('Error adding subscription:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
}