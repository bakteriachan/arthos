import { NotFoundException } from "../shared/errors.js";

export class ResourceNotFoundException extends NotFoundException {
    constructor(name) {
        super(`Resource with name ${name} not found`)
    }
}