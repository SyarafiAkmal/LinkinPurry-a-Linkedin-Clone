import { Type } from '@sinclair/typebox';

export const Subscription = Type.Object({
  userVisibleOnly: Type.Boolean(),
  applicationServerKey: Type.String(),
});