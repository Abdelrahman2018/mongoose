export class BaseError extends Error {
  status: number;
  message: string;
  errors: any[];
  fields: any[] = [];

  constructor(
    message: string = "Internal Server Error",
    status: number = 500,
    errors: any[] = []
  ) {
    super();
    this.name = this.constructor.name;
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = "Bad Request";
    this.status = 400;
    this.message = message;
  }
}

export class ConflictError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = "Conflict";
    this.status = 409;
    this.message = message;
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string) {
    super();
    this.name = "Forbidden";
    this.status = 403;
    this.message = message;
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string = "Not found") {
    super();
    this.name = "Not Found";
    this.status = 404;
    this.message = message;
  }
}

export class ServerError extends BaseError {
  constructor(message: string = "Internal Server Error") {
    super();
    this.name = "Server Error";
    this.status = 500;
    this.message = message;
  }
}

export class ValidationError extends BaseError {
  constructor(errors: any[], message: string = "validation failed") {
    super();
    this.name = "Validation Error";
    this.status = 400;
    this.message = message;
    this.errors = errors;
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super();
    this.name = "Unauthorized";
    this.status = 401;
    this.message = message;
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(message: string) {
    super();
    this.name = "Unprocessable Entity";
    this.status = 422;
    this.message = message;
  }
}
