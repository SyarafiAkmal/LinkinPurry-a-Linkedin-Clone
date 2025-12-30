import { FastifyReply, FastifyRequest } from 'fastify';

export async function getProfileHandler(
  request: FastifyRequest<{ Params: { identifier: string } }>,
  reply: FastifyReply
) {
  const { identifier } = request.params;
  let requesterId: string = "";
  
  try {
    // const decodedToken = await request.jwtVerify();
    await request.jwtVerify();
    requesterId = request.user.userId;
  } catch {
    requesterId = "";
  }
  console.log("request id: ", requesterId);
  
  try {
    const numericIdentifier: bigint = BigInt(identifier);
    const numericRequesterId: bigint = BigInt(requesterId);
    const profile = await request.server.profileService.getProfile(numericIdentifier, numericRequesterId);
    console.log(profile);
    reply.send({
      success: true,
      message: 'Profile fetched successfully',
      body: profile,
    });
  } catch (error) {
    reply.status(404).send({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch profile',
    });
  }
}

export async function updateProfileHandler(
  request: FastifyRequest<{ Params: { identifier: string }}>,
  reply: FastifyReply
) {
  const parts = request.parts();
  const { identifier } = request.params;
  let requesterId: string = "";
  
  try {
    await request.jwtVerify();
    requesterId = request.user.userId;
  } catch {
    requesterId = "";
  }
  console.log("request id: ", requesterId);

  try {
    const numericIdentifier: bigint = BigInt(identifier);
    const numericRequesterId: bigint = BigInt(requesterId);
    const updatedProfile = await request.server.profileService.updateProfile(numericIdentifier, numericRequesterId, parts);

    reply.send({
      success: true,
      message: 'Profile updated successfully',
      body: updatedProfile,
    });
  } catch (error) {
    reply.status(400).send({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update profile',
    });
  }
}