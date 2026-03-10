export class UnauthorizedError extends Error {
  status = 403;

  constructor(message = 'FORBIDDEN') {
    super(message);
    this.name = 'ForbiddenError';
  }
}