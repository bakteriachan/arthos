import { Router } from 'express'
import { Types } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { ClientModel } from './clients.schema.js'
import { ClientAlreadyExistsException } from './clients.errors.js'
import ClientsService from './clients.service.js'

const ClientRouter = Router()

ClientRouter.post('/', async (req, res) => {
    const entity = await ClientsService.create(req.body)

    return res.status(201).json(entity)
})

export { ClientRouter }
