import { BadRequestException } from "../shared/errors.js"
import { ClientAlreadyExistsException } from "./clients.errors.js"
import { ClientModel } from "./clients.schema.js"
import { Types } from "mongoose"
import { v4 as uuidv4 } from 'uuid'

export default {
    getByClientId: async function (clientId) {
        if(!clientId) throw new BadRequestException()
        const client = await ClientModel.findOne({
            clientId
        })

        if(!client) throw new ClientNotFoundException(clientId)

        return client
    },
    create: async function (dto) {
        if(!dto) throw new BadRequestException()
        const {
            email,
            name,
        } = dto

        const clientId = new Types.ObjectId().toString()
        const clientSecret = uuidv4()

        if(!email) throw new BadRequestException("Missing client email")
        if(!name) throw new BadRequestException("Missing client name")

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