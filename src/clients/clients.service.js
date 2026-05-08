import { BadRequestException } from "../shared/errors.js"
import { ClientAlreadyExistsException, ClientNotFoundException } from "./clients.errors.js"
import { ClientModel } from "./clients.schema.js"
import { Types } from "mongoose"
import { v4 as uuidv4 } from 'uuid'
import { validateDto } from "../shared/util.js"

export default {
    getByClientId: async function (clientId) {
        validateDto({ clientId }, ['clientId'])
        const client = await ClientModel.findOne({
            clientId
        })

        if(!client) throw new ClientNotFoundException(clientId)

        return client
    },
    create: async function (dto) {
        if(!dto) throw new BadRequestException()
        validateDto(dto, ['email', 'name'])
        const {
            email,
            name,
        } = dto

        const clientId = new Types.ObjectId().toString()
        const clientSecret = uuidv4()

        const exists = await ClientModel.findOne({ email: email.toLowerCase() })
        if(exists) throw new ClientAlreadyExistsException(email)

        const entity = new ClientModel({
            name,
            email: email.toLowerCase(),
            clientId,
            clientSecret,
        })
        await entity.save()

        return entity
    }
}