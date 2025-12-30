import { Type } from '@sinclair/typebox';

const DateTimeType = Type.Date();

export const ResponseFeedSchema = Type.Object({
    id: Type.Integer(),
    created_at: DateTimeType,
    updated_at: DateTimeType,
    content: Type.String(),
});

export const FeedSchema = Type.Object({
    content: Type.String(),
});