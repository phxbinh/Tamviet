export class ForbiddenError_ extends Error {
  status = 403;

  constructor(message = 'FORBIDDEN') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class ForbiddenError extends Error {
  status = 403
  code = 'FORBIDDEN_ADMIN'

  constructor(message = 'Forbidden: Admin access required') {
    super(message)
    this.name = 'ForbiddenError';
  }
}