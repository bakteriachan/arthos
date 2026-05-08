import { BadRequestException } from "./errors.js";

export function validateDto(dto, props) {
    if(Array.isArray(props)) {
        for(const prop of props) {
            if(dto[prop] == null) {
                throw new BadRequestException(`Missing ${prop}`)
            }
        }
    }
}