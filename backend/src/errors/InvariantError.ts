import { ClientError } from "./ClientError.js";

export class InvariantError extends ClientError {
  constructor(message: string) {
    super(message);
    this.name = 'InvariantError';
  }
}
