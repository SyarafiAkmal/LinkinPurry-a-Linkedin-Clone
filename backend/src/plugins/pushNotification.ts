import webpush from "web-push";
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { createPushNotificationService } from '../services/pushNotification.js';

export default fp(async function (fastify: FastifyInstance) {
    fastify.decorate('subscriptions', []);
    fastify.decorate('pushNotificationService', createPushNotificationService(fastify));

});

declare module 'fastify' {
    interface FastifyInstance {
        subscriptions: webpush.PushSubscription[];
    }
}

declare module 'fastify' {
    interface FastifyInstance {
      pushNotificationService: ReturnType<typeof createPushNotificationService>;
    }
  }