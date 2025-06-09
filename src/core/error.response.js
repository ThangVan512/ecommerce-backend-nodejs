'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
};

const ReasonStatusCode = {
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not Found',
    BAD_REQUEST: 'Bad Request',
    UNAUTHORIZED: 'Unauthorized',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    CONFLICT: 'Conflict',
    UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
    TOO_MANY_REQUESTS: 'Too Many Requests',
    SERVICE_UNAVAILABLE: 'Service Unavailable',
    GATEWAY_TIMEOUT: 'Gateway Timeout'
}
class ErrorResponse extends Error {
    constructor(message, statusCode = StatusCode.INTERNAL_SERVER_ERROR) {
        super(message);
        this.statusCode = statusCode;
        this.reason = ReasonStatusCode[Object.keys(ReasonStatusCode).find(key => StatusCode[key] === statusCode)] || 'Unknown Error';
        this.isOperational = true; // Indicates if the error is operational or programming error
    }
}

class ConflictError extends ErrorResponse {
    constructor(message = 'Conflict', statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
        this.name = 'ConflictError';
    }
}
class BadRequestError extends ErrorResponse {
    constructor(message = 'Bad Request', statusCode = StatusCode.BAD_REQUEST) { 
        super(message, statusCode);
        this.name = 'BadRequestError';
    }
}
class NotFoundError extends ErrorResponse {
    constructor(message = 'Not Found', statusCode = StatusCode.NOT_FOUND) {
        super(message, statusCode);
        this.name = 'NotFoundError';
    }
}
class ForbiddenError extends ErrorResponse {
    constructor(message = 'Forbidden', statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
        this.name = 'ForbiddenError';
    }
}
class UnauthorizedError extends ErrorResponse {
    constructor(message = 'Unauthorized', statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode);
        this.name = 'UnauthorizedError';
    }
}
class InternalServerError extends ErrorResponse {
    constructor(message = 'Internal Server Error', statusCode = StatusCode.INTERNAL_SERVER_ERROR) {
        super(message, statusCode);
        this.name = 'InternalServerError';
    }   
}

module.exports = {
    ErrorResponse,
    StatusCode,
    ReasonStatusCode,
    ConflictError,
    BadRequestError,
    NotFoundError,
    ForbiddenError,
    UnauthorizedError,
    InternalServerError
};