import { ClientError } from "./ClientError.js";

export class AuthenticationError extends ClientError {
  constructor(message: string) {
    super(message);
    this.statusCode = 401;
    this.name = 'NotFoundError';
  }
}
