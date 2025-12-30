import { Type } from '@sinclair/typebox';

export const LoginRequestSchema = Type.Object({
  identifier: Type.String(),
  password: Type.String(),
});

export const LoginResponseSchema = Type.Object({
  success: Type.Boolean(),
  message: Type.String(),
  body: Type.Object({
    token: Type.String(),
  }),
});

export const RegisterRequestSchema = Type.Object({
  username: Type.String(),
  email: Type.String({ format: 'email' }),
  name: Type.String(),
  password: Type.String(),
});

export const RegisterResponseSchema = Type.Object({
  success: Type.Boolean(),
  message: Type.String(),
  body: Type.Object({
    token: Type.String(),
  }),
});
