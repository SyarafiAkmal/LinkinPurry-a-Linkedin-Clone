import { ClientError } from "./ClientError.js";

export class NotFoundError extends ClientError {
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}
