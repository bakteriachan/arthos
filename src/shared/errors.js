export class HttpException {
    statusCode = 500
    message = "Internal Server Error"
    constructor(code, message) {
        this.statusCode = code
        this.message = message
    }
}
export class NotFoundException extends HttpException {
    constructor(message = "Not Found") {
        super(404, message)
    }
}

export class ConflictException extends HttpException {
    constructor(message = "Conflict") {
        super(409, message)
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message = "Unauthorized") {
        super(401, message)
    }
}

export class BadRequestException extends HttpException {
    constructor(message = 'Bad Request') {
        super(404, message)
    }
}