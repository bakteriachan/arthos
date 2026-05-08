import { Router } from 'express'
import ClientsService from './clients.service.js'

const ClientRouter = Router()

ClientRouter.post('/', async (req, res) => {
    const entity = await ClientsService.create(req.body)

    return res.status(201).json(entity)
})

export { ClientRouter }
