import { Type } from '@sinclair/typebox'; 

export const UserConnectionsResponseSchema = Type.Object({
  success: Type.Boolean(),
  message: Type.String(),
  body: Type.Object({
    users: Type.Array(Type.Object({
      id: Type.String(),
      full_name: Type.Optional(Type.String()),
      profile_photo_path: Type.String(),
    })),
  }),
});

export const ConnectionRequestRequestSchema = Type.Object({
  to_id: Type.String(),
});

export const ConnectionSchema = Type.Object({
    from_id: Type.String(),
    to_id: Type.String(),
    created_at: Type.Optional(Type.String({ format: 'date-time' })),
});

export const ConnectionRequestResponseSchema = Type.Object({
  success: Type.Boolean(),
  message: Type.String(),
  body: ConnectionSchema,
})

export const UserSchema = Type.Object({
    id: Type.String(),
    username: Type.String(),
    email: Type.String(),
    work_history: Type.Union([Type.String(), Type.Null()]),
    skills: Type.Union([Type.String(), Type.Null()]),
});

export const UserListSchema = Type.Object({
    users: Type.Array(UserSchema),
});

export const ConnectionRequestsResponseSchema = Type.Object({
  success: Type.Boolean(),
  message: Type.String(),
  body: UserListSchema,
})