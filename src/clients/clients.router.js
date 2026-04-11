import { Router } from 'express'
import { Types } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { ClientModel } from './clients.schema.js'

const ClientRouter = Router()

ClientRouter.post('/', async (req, res) => {
    const name = req.body?.name
    const email = req.body?.email
    const clientId = new Types.ObjectId().toString()
    const clientSecret = uuidv4()

    if(!name) {
        return res.status(400).json({ statusCode: 400, error: 'Missing name' })
    }
    if(!email) {
        return res.status(400).json({ statusCode: 400, error: 'Missing email' })
    }

    const client = await ClientModel.findOne({ email: email.toLowerCase() })

    if(client) {
        throw new Error('Client with email already exists')
    }

    const entity = new ClientModel({
        name,
        email,
        clientId,
        clientSecret,
    })
    entity.save()

    return res.status(201).json({
        name,
        email,
        clientId,
        clientSecret,
    })
})

export { ClientRouter }
