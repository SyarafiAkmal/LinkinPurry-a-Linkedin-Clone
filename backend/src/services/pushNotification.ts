import webpush from 'web-push';
import { FastifyInstance } from 'fastify';

export function createPushNotificationService(fastify: FastifyInstance) {
  const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || "",
    privateKey: process.env.VAPID_PRIVATE_KEY || "",
  };

  webpush.setVapidDetails(
    'mailto:test@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  return {
    async addSubscription(subscription: webpush.PushSubscription, requesterId: string) {
      const userId = BigInt(requesterId);

      await fastify.prisma.push_subscriptions.upsert({
        where: { endpoint: subscription.endpoint },
        update: { 
          keys: {
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth
          }, 
          user_id: userId
        },
        create: {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth
          },
          user_id: userId,
        },
      });
    },

    async sendNotification(title: string, content: string, isChat: boolean, subscriptionUserIds: string[]) {
      const notificationPayload = {
        title: title,
        body: content,
        icon: '@/assets/logo.svg',
        data: {
          url: isChat ? 'localhost:3000/api/users/me' : '/feed',
        },
      };

      try {
        const subscriptions = await fastify.prisma.push_subscriptions.findMany({
          where: {
            user_id: {
              in: subscriptionUserIds.map((id) => BigInt(id)), // Convert userIds to BigInt if necessary
            },
          },
        });

        await Promise.all(
          subscriptions.map((subscription: webpush.PushSubscription) => {
            const keys = typeof subscription.keys === 'object' && subscription.keys !== null 
              ? {
                  p256dh: (subscription.keys as any).p256dh,
                  auth: (subscription.keys as any).auth
                }
              : undefined;

            if (keys && keys.p256dh && keys.auth) {
              const pushSubscription: webpush.PushSubscription = {
                endpoint: subscription.endpoint,
                keys: keys,
              };
      
              return webpush.sendNotification(pushSubscription, JSON.stringify(notificationPayload))
                .catch((err) => {
                  console.error('Error sending to subscription:', subscription.endpoint, err);
                });
            }

            console.error('Invalid subscription keys:', subscription.endpoint);
            return Promise.resolve();
          })
        );
      } catch (error) {
        console.error('Error sending notifications:', error);
      }
    },
  };
}