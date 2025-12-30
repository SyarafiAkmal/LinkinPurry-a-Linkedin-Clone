import { FastifyReply, FastifyRequest } from 'fastify';
import { Static} from '@sinclair/typebox';
import { FeedSchema } from '../schemas/feed.js';

interface FeedQuery {
  cursor?: string;
  limit?: number;
}

export async function getFeedHandler(
  request: FastifyRequest<{ Querystring: FeedQuery }>,
  reply: FastifyReply
) {
  const { cursor, limit = 10 } = request.query;
  let requesterId: string = "";

  try {
    await request.jwtVerify();
    requesterId = request.user.userId;
  } catch {
    requesterId = "";
  }
  console.log("request id: ", requesterId);

  try {
    const numericLimit = Math.max(Number(limit), 1);
    const numericCursor = cursor ? BigInt(cursor) : undefined;
    const numericRequesterId: bigint = BigInt(requesterId);
    const feed = await request.server.feedService.getFeed(numericRequesterId, numericCursor, numericLimit);
    console.log(feed);
    reply.send({
      success: true,
      message: 'Feed fetched successfully',
      body: feed,
    });
  } catch (error) {
    reply.status(404).send({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch feed',
    });
  }
}

export async function createFeedHandler(
  request: FastifyRequest<{ Body: Static<typeof FeedSchema> }>,
  reply: FastifyReply
) {
  const { content } = request.body;
  let requesterId: string = "";
  
  try {
    await request.jwtVerify();
    requesterId = request.user.userId;
  } catch {
    requesterId = "";
  }

  try {
    const numericRequesterId: bigint = BigInt(requesterId);
    const createdFeed = await request.server.feedService.createFeed(numericRequesterId, content);

    const connections = await request.server.connectionService.getUserConnections(requesterId);
    const user = await request.server.userService.getUserById(numericRequesterId);

    const connectionIds = connections.map((connection) => connection.id);

    const title = `${user?.full_name} has a new post`;
    
    request.server.pushNotificationService.sendNotification(title, content, false, connectionIds);
    
    reply.send({
      success: true,
      message: 'Feed created successfully',
      body: createdFeed
    });
  } catch (error) {
    console.log(error);
    reply.status(400).send({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create feed',
    });
  }
}

export async function updateFeedHandler(
    request: FastifyRequest<{ Params: { identifier: string }, Body: Static<typeof FeedSchema> }>,
    reply: FastifyReply
) {
    const { identifier } = request.params;
    const { content } = request.body;

    let requesterId: string = "";
    
    try {
      await request.jwtVerify();
      requesterId = request.user.userId;
    } catch {
      requesterId = "";
    }
    console.log('requester: ', requesterId);

    try {
      const numericIdentifier: bigint = BigInt(identifier);
      const numericRequesterId: bigint = BigInt(requesterId);
      if (!(await request.server.feedService.isFeedOwner(numericRequesterId, numericIdentifier))) {
        throw new Error('Unauthorized');
      }      
      const updatedFeed = await request.server.feedService.updateFeed(numericIdentifier, content);
      reply.send({
        success: true,
        message: 'Feed updated successfully',
        body: updatedFeed
      });
    } catch (error) {
      reply.status(400).send({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update feed',
      });
    }
}

export async function deleteFeedHandler(
    request: FastifyRequest<{ Params: { identifier: string } }>,
    reply: FastifyReply
) {
    const { identifier } = request.params;
    let requesterId: string = "";
    
    try {
      await request.jwtVerify();
      requesterId = request.user.userId;
    } catch {
      requesterId = "";
    }
    console.log('requester: ', requesterId);

    try {
        const numericIdentifier: bigint = BigInt(identifier);
        const numericRequesterId: bigint = BigInt(requesterId);
        if (!(await request.server.feedService.isFeedOwner(numericRequesterId, numericIdentifier))) {
          throw new Error('Unauthorized');
        }        
        await request.server.feedService.deleteFeed(numericIdentifier);
        reply.send({
          success: true,
          message: 'Feed deleted successfully',
        });
      } catch (error) {
        reply.status(400).send({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to dele feed',
        });
      }
}