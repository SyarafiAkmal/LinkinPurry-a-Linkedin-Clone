import { Type } from "@sinclair/typebox";

export const UserSchema = Type.Object({
    id: Type.String(),
    full_name: Type.String(),
    profile_photo_path: Type.Optional(Type.String()),
});

export const UserListSchema = Type.Object({
    users: Type.Array(UserSchema),
});