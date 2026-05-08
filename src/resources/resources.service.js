import { BadRequestException } from "../shared/errors.js"
import { validateDto } from "../shared/util.js"
import { ResourceNotFoundException } from "./resources.errors.js"
import { ResourceModel } from "./resources.schema.js"

export default {
    create: async function (dto) {
        if(!dto) throw new BadRequestException()
        const {
            clientId,
            requiredScopes,
            name,
        } = dto
        validateDto(dto, ['clientId', 'requiredScopes', 'name'])
        const resource = new ResourceModel({
            clientId,
            requiredScopes,
            name,
        })
        await resource.save()
        return resource.toJSON()
    },
    getAllByClientId: async function (clientId) {
        validateDto({ clientId }, ['clientId'])
        
        const resources = await ResourceModel.find({ clientId }).exec()
        return resources.map(r => r.toJSON())
    },
    getByName: async function (name, clientId) {
        validateDto({ name, clientId }, ['name', 'clientId'])

        const resource = await ResourceModel.findOne({ name, clientId })
        if(!resource) throw new ResourceNotFoundException(name)
        return resource.toJSON()
    },
}