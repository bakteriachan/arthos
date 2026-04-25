import { ConflictException, NotFoundException } from "../shared/errors.js";

export class ClientAlreadyExistsException extends ConflictException {
    constructor(email) {
        super(`Client with email ${email} already exists exception`)
    }
}

export class ClientNotFoundException extends NotFoundException {
    constructor(clientId) {
        super(`Client with id ${clientId} not found`)
    }
}