import { Type } from '@sinclair/typebox';

export const DefaultResponse = Type.Object({
  success: Type.Boolean(),
  message: Type.String(),
  error: Type.String()
});