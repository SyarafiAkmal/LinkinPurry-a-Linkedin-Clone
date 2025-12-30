import { Type } from '@sinclair/typebox';

export const ChatSchema = Type.Object({
    id: Type.String(),
    from_id: Type.String(),
    to_id: Type.String(),
    message: Type.String(),
    timestamp: Type.Optional(Type.String({ format: 'date-time' }))
});

export const ChatListSchema = Type.Object({
    chathistory: Type.Array(ChatSchema),
});
