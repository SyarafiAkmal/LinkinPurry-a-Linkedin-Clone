import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  user_id: string;
}

export const getUserIdFromToken = (): string => {
  console.log(document.cookie);
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (token) {
    try {
        console.log('b');
        const payload: TokenPayload = jwtDecode(token);
        return payload.user_id;
    } catch (error) {
        console.error("Invalid token", error);
        return "";
    }
  }

  return "";
};