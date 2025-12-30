import { Type } from '@sinclair/typebox';

export const ProfileFeedSchema = Type.Object({
  id: Type.String(), 
  created_at: Type.String(),
  updated_at: Type.String(), 
  content: Type.String(),
});

export const ProfileSchema = Type.Object({
  name: Type.Union([Type.String(), Type.Null()]),
  profile_photo: Type.String(),
  connection_count: Type.Number(),
  email: Type.Optional(Type.String()),
  username: Type.Optional(Type.String()),
  work_history: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  skills: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  relevant_posts: Type.Optional(Type.Array(ProfileFeedSchema)), 
  isButton: Type.Optional(Type.Boolean()),
});

export const GetProfileSchema = Type.Object({
  ProfileSchema,
});

export const ProfileResponseSchema = Type.Object({
    success: Type.Boolean(),
    message: Type.String(),
    body: ProfileSchema
});

export const ProfilePutRequestSchema = Type.Object({
  username: Type.String(),
  name: Type.Union([Type.String(), Type.Null()]),
  profile_photo: Type.Optional(Type.String()),
  work_history: Type.Union([Type.String(), Type.Null()]),
  skills: Type.Union([Type.String(), Type.Null()]),
});