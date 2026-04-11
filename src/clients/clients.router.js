import { Router } from 'express'
import { Types } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { ClientModel } from './clients.schema.js'

const ClientRouter = Router()

ClientRouter.post('/', async (req, res) => {
    const { name, email } = req.body
    const clientId = new Types.ObjectId()
    const clientSecret = uuidv4()

    if(!name) {
        return res.status(400).json({ statusCode: 400, error: 'Missing name' })
    }
    if(!email) {
        return res.status(400).json({ statusCode: 400, error: 'Missing email' })
    }

    const entity = new ClientModel({
        name,
        email,
        _id: clientId,
        clientSecret,
    })
    entity.save()

    return res.status(201).json({
        name,
        email,
        clientId: clientId.toString(),
        clientSecret,
    })
})

export { ClientRouter }
