'use strict'

const StatusCode = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    RESET_CONTENT: 205,
    PARTIAL_CONTENT: 206,
    MULTI_STATUS: 207,
    IM_USED: 226
};

const ReasonStatusCode = {
    OK: 'OK',
    CREATED: 'Created',
    ACCEPTED: 'Accepted',
    NO_CONTENT: 'No Content',
    RESET_CONTENT: 'Reset Content',
    PARTIAL_CONTENT: 'Partial Content',
    MULTI_STATUS: 'Multi-Status',
    IM_USED: 'IM Used'
}

class SuccessResponse {
    constructor(message, statusCode = StatusCode.OK) {
        this.message = message;
        this.statusCode = statusCode;
        this.reason = ReasonStatusCode[Object.keys(ReasonStatusCode).find(key => StatusCode[key] === statusCode)] || 'Unknown Success';
        this.isOperational = true; // Indicates if the response is operational
    }
    send(res) {
        return res.status(this.statusCode).json({
            message: this.message,
            statusCode: this.statusCode,
            reason: this.reason
        });
    }
}

class OKResponse extends SuccessResponse {
    constructor(message = 'OK', statusCode = StatusCode.OK) {   
        super(message, statusCode);
        this.name = 'OKResponse';
    }
}
class CreatedResponse extends SuccessResponse {
    constructor(message = 'Created', statusCode = StatusCode.CREATED) {
        super(message, statusCode);
        this.name = 'CreatedResponse';
    }
}
class AcceptedResponse extends SuccessResponse {
    constructor(message = 'Accepted', statusCode = StatusCode.ACCEPTED) {
        super(message, statusCode);
        this.name = 'AcceptedResponse';
    }
}
class NoContentResponse extends SuccessResponse {
    constructor(message = 'No Content', statusCode = StatusCode.NO_CONTENT) {
        super(message, statusCode);
        this.name = 'NoContentResponse';
    }
}
class ResetContentResponse extends SuccessResponse {
    constructor(message = 'Reset Content', statusCode = StatusCode.RESET_CONTENT) {
        super(message, statusCode);
        this.name = 'ResetContentResponse';
    }
}
class PartialContentResponse extends SuccessResponse {
    constructor(message = 'Partial Content', statusCode = StatusCode.PARTIAL_CONTENT) {
        super(message, statusCode);
        this.name = 'PartialContentResponse';
    }
}
class MultiStatusResponse extends SuccessResponse {
    constructor(message = 'Multi-Status', statusCode = StatusCode.MULTI_STATUS) {
        super(message, statusCode);
        this.name = 'MultiStatusResponse';
    }
}
class IMUsedResponse extends SuccessResponse {
    constructor(message = 'IM Used', statusCode = StatusCode.IM_USED) {
        super(message, statusCode);
        this.name = 'IMUsedResponse';
    }
}

module.exports = {
    SuccessResponse,
    StatusCode,
    ReasonStatusCode,
    OKResponse,
    CreatedResponse,
    AcceptedResponse,
    NoContentResponse,
    ResetContentResponse,
    PartialContentResponse,
    MultiStatusResponse,
    IMUsedResponse
};