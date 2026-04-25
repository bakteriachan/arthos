import { BadRequestException } from "../shared/errors.js"

export default {
    create: async function (dto) {
        if(!dto) throw new BadRequestException()
        const { 
            name,
            email,
            password,
            clientId,
            scopes,
        } = dto

        if(!name) throw new BadRequestException("Missing user name")
        if(!email) throw new BadRequestException("Missing user email")
        if(!password) throw new BadRequestException("Missing user password")
        if(!clientId) throw new BadRequestException("Missing clientId")
        

    }
}